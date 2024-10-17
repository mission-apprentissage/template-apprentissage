import type { ConditionalExcept, EmptyObject, Jsonify } from "type-fest";
import type { z, ZodType } from "zod";

import { zProcessorAdminRoutes } from "./_private/admin/processor.admin.routes";
import { zUserAdminRoutes } from "./_private/admin/users.admin.routes";
import { zAuthRoutes } from "./_private/auth.routes";
import { zEmailRoutes } from "./_private/emails.routes";
import { zUserRoutes } from "./_private/user.routes";
import type { IRouteSchema, IRouteSchemaWrite } from "./common.routes";
import { zCoreRoutes } from "./healthcheck.routes";

const zRoutesGet = {
  ...zUserAdminRoutes.get,
  ...zProcessorAdminRoutes.get,
  ...zUserRoutes.get,
  ...zAuthRoutes.get,
  ...zCoreRoutes.get,
  ...zEmailRoutes.get,
} as const;

const zRoutesPost = {
  ...zUserAdminRoutes.post,
  ...zUserRoutes.post,
  ...zAuthRoutes.post,
  ...zEmailRoutes.post,
} as const;

const zRoutesPut = {
  ...zUserAdminRoutes.put,
} as const;

const zRoutesDelete = {
  ...zUserRoutes.delete,
} as const;

export type IGetRoutes = typeof zRoutesGet;
export type IPostRoutes = typeof zRoutesPost;
export type IPutRoutes = typeof zRoutesPut;
export type IDeleteRoutes = typeof zRoutesDelete;

export type IRoutes = {
  get: IGetRoutes;
  post: IPostRoutes;
  put: IPutRoutes;
  delete: IDeleteRoutes;
};

export type IRoutesPath = {
  get: keyof IRoutes["get"];
  post: keyof IRoutes["post"];
  put: keyof IRoutes["put"];
  delete: keyof IRoutes["delete"];
};

export const zRoutes: IRoutes = {
  get: zRoutesGet,
  post: zRoutesPost,
  put: zRoutesPut,
  delete: zRoutesDelete,
} as const;

export type IResponse<S extends IRouteSchema> = S["response"][`200`] extends ZodType
  ? Jsonify<z.output<S["response"][`200`]>>
  : S["response"][`2${string}`] extends ZodType
    ? Jsonify<z.output<S["response"][`2${string}`]>>
    : never;

export type IBody<S extends IRouteSchemaWrite> = S["body"] extends ZodType ? z.input<S["body"]> : never;

export type IQuery<S extends IRouteSchema> = S["querystring"] extends ZodType ? z.input<S["querystring"]> : never;

export type IParam<S extends IRouteSchema> = S["params"] extends ZodType ? z.input<S["params"]> : never;

type IHeadersAuth<S extends IRouteSchema> = S extends { securityScheme: { auth: infer A } }
  ? A extends "access-token" | "api-key"
    ? { authorization: `Bearer ${string}` }
    : object
  : object;

export type IHeaders<S extends IRouteSchema> = S["headers"] extends ZodType
  ? Omit<z.input<S["headers"]>, "referrer">
  : object;

type IRequestRaw<S extends IRouteSchema> = {
  params: IParam<S>;
  querystring: IQuery<S>;
  headers: IHeaders<S> & IHeadersAuth<S> extends EmptyObject ? never : IHeaders<S> & IHeadersAuth<S>;
  body: S extends IRouteSchemaWrite ? IBody<S> : never;
  signal?: AbortSignal;
};

export type IRequest<S extends IRouteSchema> =
  ConditionalExcept<IRequestRaw<S>, never> extends EmptyObject ? EmptyObject : ConditionalExcept<IRequestRaw<S>, never>;
