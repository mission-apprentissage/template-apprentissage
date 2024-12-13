/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

import { withSentryConfig } from "@sentry/nextjs";
import { withPlausibleProxy } from "next-plausible";
import path from "path";
import { fileURLToPath } from "url";

const nextConfig = {
  transpilePackages: ["shared"],
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  swcMinify: true,
  experimental: {
    outputFileTracingRoot: path.join(path.dirname(fileURLToPath(import.meta.url)), "../"),
    typedRoutes: true,
    instrumentationHook: true,
  },

  async redirects() {
    return [
      {
        source: "/catalogue-des-donnees/:slug*",
        destination: "/explorer/:slug*", // Matched parameters can be used in the destination
        permanent: true,
      },
    ];
  },
  output: "standalone",
  sentry: {
    hideSourceMaps: false,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.woff2$/,
      type: "asset/resource",
    });
    // Bson is using top-level await, which is not supported by default in Next.js in client side
    // Probably related to https://github.com/vercel/next.js/issues/54282
    config.resolve.alias.bson = path.join(path.dirname(fileURLToPath(import.meta.resolve("bson"))), "bson.cjs");

    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
      ".cjs": [".cts", ".cjs"],
    };
    return config;
  },
};

export default withSentryConfig(withPlausibleProxy()(nextConfig), {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "sentry",
  project: "api-ui",
  sentryUrl: "https://sentry.apprentissage.beta.gouv.fr/",

  // Only print logs for uploading source maps in CI
  silent: false,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: false,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  // automaticVercelMonitors: true,
});
