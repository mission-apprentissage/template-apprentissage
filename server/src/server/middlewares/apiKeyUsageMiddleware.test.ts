import { useMongo } from "@tests/mongo.test.utils";
import { fastify } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { generateUserFixture } from "shared/src/models/fixtures/index";
import type { IUser } from "shared/src/models/user.model";
import type { IRouteSchema, ISecuredRouteSchema, WithSecurityScheme } from "shared/src/routes/common.routes";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { generateApiKey } from "@/actions/users.actions";
import type { Server } from "@/server/server";
import { getDbCollection } from "@/services/mongodb/mongodbService";

import { apiKeyUsageMiddleware } from "./apiKeyUsageMiddleware";
import { auth } from "./authMiddleware";
import { errorMiddleware } from "./errorMiddleware";

useMongo();

describe("apiKeyUsageMiddleware", () => {
  const getSchema = {
    method: "get",
    path: "/",
    response: { 200: z.any() },
    securityScheme: {
      auth: "api-key",
      access: null,
      ressources: {},
    },
  } as const satisfies ISecuredRouteSchema;
  const getSchemaPublic = {
    method: "get",
    path: "/public",
    response: { 200: z.any() },
    securityScheme: null,
  } as const satisfies IRouteSchema;
  const postSchema = {
    method: "post",
    path: "/:name",
    params: z.object({ name: z.string() }),
    body: z.object({ code: z.number() }),
    response: { 200: z.any() },
    securityScheme: {
      auth: "api-key",
      access: null,
      ressources: {},
    },
  } as const satisfies ISecuredRouteSchema;

  const app: Server = fastify().withTypeProvider<ZodTypeProvider>();
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.decorate("auth", <S extends IRouteSchema & WithSecurityScheme>(scheme: S) => auth(scheme));

  app.post("/:name", { schema: postSchema, onRequest: [app.auth(postSchema)] }, async (request, response) => {
    return response.status(request.body.code).send({ ok: true });
  });
  app.get("/public", { schema: getSchemaPublic }, async (_request, response) => {
    return response.status(200).send({ ok: true });
  });
  app.get("/", { schema: getSchema, onRequest: [app.auth(getSchema)] }, async (_request, response) => {
    return response.status(200).send({ ok: true });
  });
  app.setNotFoundHandler((_request, response) => {
    response.status(404).send({ ok: false });
  });

  apiKeyUsageMiddleware(app);
  errorMiddleware(app);

  beforeAll(async () => {
    await app.ready();
    return () => app.close();
  });

  let token: string;
  let user: IUser;

  beforeEach(async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date("2024-03-21T00:00:00Z"));

    user = generateUserFixture({
      email: "user@exemple.fr",
      is_admin: false,
    });
    await getDbCollection("users").insertOne(user);
    token = (await generateApiKey("", user)).value;
    user = (await getDbCollection("users").findOne({ _id: user._id }))!;

    return () => {
      vi.useRealTimers();
    };
  });

  const runGet = () =>
    app.inject({
      method: "GET",
      url: "/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  const runGetPublic = () =>
    app.inject({
      method: "GET",
      url: "/public",
    });

  const runPost = (name: string, code: number) =>
    app.inject({
      method: "POST",
      url: `/${name}`,
      body: { code },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

  it("should register usage for authenticated user with api key", async () => {
    const response = await runGet();
    expect.soft(response.statusCode).toBe(200);
    expect.soft(response.json()).toEqual({ ok: true });

    await runGet();
    // We advance time by 23 hours
    vi.advanceTimersByTime(23 * 3600_000);
    await runGet();

    // We advance time by 1 hour
    vi.advanceTimersByTime(3600_000);
    await runGet();
  });

  it("should register the config path not real one", async () => {
    await runPost("value1", 200);
    await runPost("value2", 200);
    await runPost("value3", 400);
  });

  it("should not register usage for unauthenticated routes", async () => {
    await runGetPublic();
  });

  it("should support concurrency", async () => {
    const tasks = [];
    for (let i = 0; i < 50; i++) {
      tasks.push(runGet());
    }
    await Promise.all(tasks);
  });
});
