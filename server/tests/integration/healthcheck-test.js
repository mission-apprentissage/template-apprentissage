const assert = require("assert");
const httpTests = require("../utils/httpTests");
const config = require("config");

httpTests(__filename, ({ startServer }) => {
  it("Vérifie que le server fonctionne", async () => {
    let { httpClient } = await startServer();

    let response = await httpClient.get("/api");

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.data.name, `Serveur MNA - ${config.appName}`);
    assert.strictEqual(response.data.healthcheck.mongodb, true);
    assert.ok(response.data.env);
    assert.ok(response.data.version);
  });
});
