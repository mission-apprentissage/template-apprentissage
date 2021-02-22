const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const config = require("config");
const logger = require("../common/logger");
const bodyParser = require("body-parser");
const logMiddleware = require("./middlewares/logMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
const tryCatch = require("./middlewares/tryCatchMiddleware");
const apiKeyAuthMiddleware = require("./middlewares/apiKeyAuthMiddleware");
const corsMiddleware = require("./middlewares/corsMiddleware");
const authMiddleware = require("./middlewares/authMiddleware");
const permissionsMiddleware = require("./middlewares/permissionsMiddleware");
const packageJson = require("../../package.json");
const hello = require("./routes/hello");
const entity = require("./routes/entity");
const secured = require("./routes/secured");
const auth = require("./routes/auth");
const authentified = require("./routes/authentified");
const admin = require("./routes/admin");
const password = require("./routes/password");
const stats = require("./routes/stats");

require("../common/passport-config");

module.exports = async (components) => {
  const { db } = components;
  const app = express();
  const adminOnly = permissionsMiddleware({ isAdmin: true });

  app.use(bodyParser.json());
  app.use(corsMiddleware());
  app.use(logMiddleware());

  if (config.env != "dev") {
    app.set("trust proxy", 1);
  }

  app.use(
    session({
      saveUninitialized: false,
      resave: true,
      secret: config.auth.secret,
      store: new MongoStore({ mongooseConnection: db }),
      cookie: {
        secure: config.env === "dev" ? false : true,
        maxAge: config.env === "dev" ? null : 30 * 24 * 60 * 60 * 1000,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api/helloRoute", hello());
  app.use("/api/entity", entity());
  app.use("/api/secured", apiKeyAuthMiddleware, secured());
  app.use("/api/auth", auth(components));
  app.use("/api/authentified", authMiddleware, authentified());
  app.use("/api/admin", authMiddleware, adminOnly, admin());
  app.use("/api/password", password(components));
  app.use("/api/stats", authMiddleware, adminOnly, stats(components));

  app.get(
    "/api",
    tryCatch(async (req, res) => {
      let mongodbStatus;
      await db
        .collection("sample")
        .stats()
        .then(() => {
          mongodbStatus = true;
        })
        .catch((e) => {
          mongodbStatus = false;
          logger.error("Healthcheck failed", e);
        });

      return res.json({
        name: `Serveur MNA - ${config.appName}`,
        version: packageJson.version,
        env: config.env,
        healthcheck: {
          mongodb: mongodbStatus,
        },
      });
    })
  );

  app.use(errorMiddleware());

  return app;
};
