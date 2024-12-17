import { forbidden, internal } from "@hapi/boom";
import type { FastifyRequest } from "fastify";
import type { ObjectId } from "mongodb";
import type { IOrganisation } from "shared/models/organisation.model";
import type { IUser } from "shared/models/user.model";
import type { IAccessToken, IRouteSchema, SchemaWithSecurity, WithSecurityScheme } from "shared/routes/common.routes";
import type { AccessPermission, AccessResourcePath, Role } from "shared/security/permissions";
import { AdminRole, getBaseRole } from "shared/security/permissions";
import type { PathParam, QueryString } from "shared/src/helpers/generateUri.js";
import { assertUnreachable } from "shared/utils/assertUnreachable";
import type { Primitive } from "zod";
import { zObjectId } from "zod-mongodb-schema";

import { getDbCollection } from "@/services/mongodb/mongodbService.js";

import { getAccessTokenScope } from "./accessTokenService.js";
import { getUserFromRequest } from "./authenticationService.js";

export type Ressources = {
  users: Array<IUser>;
};

// Specify what we need to simplify mocking in tests
type IRequest = Pick<FastifyRequest, "user" | "params" | "query" | "organisation">;

function getAccessResourcePathValue(path: AccessResourcePath, req: IRequest) {
  const obj = req[path.type] as Record<string, Primitive>;
  return obj[path.key];
}

async function getUserResource<S extends WithSecurityScheme>(schema: S, req: IRequest): Promise<Ressources["users"]> {
  if (!schema.securityScheme.ressources.user) {
    return [];
  }

  return (
    await Promise.all(
      schema.securityScheme.ressources.user.map(async (userDef) => {
        if ("_id" in userDef) {
          const userOpt = await getDbCollection("users").findOne({
            _id: zObjectId.parse(getAccessResourcePathValue(userDef._id, req)),
          });

          return userOpt ? [userOpt] : [];
        }

        assertUnreachable(userDef);
      })
    )
  ).flatMap((_) => _);
}

export async function getResources<S extends WithSecurityScheme>(schema: S, req: IRequest): Promise<Ressources> {
  const [users] = await Promise.all([getUserResource(schema, req)]);

  return {
    users,
  };
}

function getUserRole(userOrToken: IAccessToken | IUser, organisation: IOrganisation | null): Role {
  if ("identity" in userOrToken) {
    return getBaseRole(organisation);
  }

  return userOrToken.is_admin ? AdminRole : getBaseRole(organisation);
}

function canAccessUser(user: IUser, resource: Ressources["users"][number]): boolean {
  return user.is_admin || resource._id.toString() === user._id.toString();
}

export function isAuthorizedUser(
  access: AccessPermission,
  user: IUser,
  resources: Ressources,
  organisation: IOrganisation | null
): boolean {
  if (!getUserRole(user, organisation).permissions.includes(access)) {
    return false;
  }

  switch (access) {
    case "user:manage":
      return resources.users.every((r) => canAccessUser(user, r));
    case "admin":
      return user.is_admin;
    case "jobs:write":
      return true;
    default:
      assertUnreachable(access);
  }
}

function canAccessRessource(
  allowedIds: ReadonlyArray<string> | undefined,
  requiredResources: Array<{ _id: ObjectId }>
) {
  const set: Set<string> = new Set(allowedIds);

  for (const resource of requiredResources) {
    if (!set.has(resource._id.toString())) {
      return false;
    }
  }

  return true;
}

export function isAuthorizedToken<S extends SchemaWithSecurity>(
  token: IAccessToken,
  resources: Ressources,
  schema: Pick<S, "method" | "path">,
  params: PathParam | undefined,
  querystring: QueryString | undefined
): boolean {
  const scope = getAccessTokenScope(token, schema, params, querystring);

  const keys = Object.keys(resources) as Array<keyof Ressources>;
  for (const key of keys) {
    switch (key) {
      case "users": {
        if (!canAccessRessource(scope?.resources.user, resources.users)) {
          return false;
        }
        break;
      }
      default:
        assertUnreachable(key);
    }
  }

  return true;
}

export async function authorizationnMiddleware<S extends Pick<IRouteSchema, "method" | "path"> & WithSecurityScheme>(
  schema: S,
  req: IRequest
) {
  if (!schema.securityScheme) {
    throw internal(`authorizationnMiddleware: route doesn't have security scheme`, {
      method: schema.method,
      path: schema.path,
    });
  }

  const userOrToken = getUserFromRequest(req, schema);

  if (schema.securityScheme.access === null) {
    return;
  }

  const resources = await getResources(schema, req);

  const isAuthorized =
    "identity" in userOrToken
      ? isAuthorizedToken(userOrToken, resources, schema, req.params as PathParam, req.query as QueryString)
      : isAuthorizedUser(schema.securityScheme.access, userOrToken, resources, req.organisation ?? null);

  if (!isAuthorized) {
    throw forbidden("Vous n'êtes pas autorisé à accéder à cette ressource");
  }
}
