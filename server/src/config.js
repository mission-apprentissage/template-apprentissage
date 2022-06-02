import env from "env-var";

const config = {
  env: env.get("MNAPROJECTNAME_ENV").default("local").asString(),
  publicUrl: env.get("MNAPROJECTNAME_PUBLIC_URL").default("http://localhost").asString(),
  log: {
    level: env.get("MNAPROJECTNAME_LOG_LEVEL").default("info").asString(),
    format: env.get("MNAPROJECTNAME_LOG_FORMAT").default("pretty").asString(),
    destinations: env.get("MNAPROJECTNAME_LOG_DESTINATIONS").default("stdout").asArray(),
  },
  slackWebhookUrl: env.get("MNAPROJECTNAME_SLACK_WEBHOOK_URL").asString(),
  mongodb: {
    uri: env
      .get("MNAPROJECTNAME_MONGODB_URI")
      .default("mongodb://127.0.0.1:27017/referentiel?retryWrites=true&w=majority")
      .asString(),
  },
};

export default config;
