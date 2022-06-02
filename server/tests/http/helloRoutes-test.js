import assert from "assert";
import { startServer } from "../utils/testUtils.js";

describe("helloRoute", () => {
  it("Vérifie que la route fonctionne", async () => {
    const { httpClient } = await startServer();

    const response = await httpClient.get("/api/hello");

    assert.strictEqual(response.status, 200);
    assert.ok(response.data.message);
  });
});
