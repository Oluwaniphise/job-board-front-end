import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      (rule: { test?: { test: (value: string) => boolean } }) =>
        rule.test?.test?.(".svg")
    );
    if (!fileLoaderRule) {
      return config;
    }

    const typedFileLoaderRule = fileLoaderRule as {
      issuer?: unknown;
      resourceQuery?: { not?: RegExp[] };
      exclude?: RegExp;
      [key: string]: unknown;
    };

    config.module.rules.push(
      {
        ...typedFileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: typedFileLoaderRule.issuer,
        resourceQuery: {
          not: [...(typedFileLoaderRule.resourceQuery?.not ?? []), /url/],
        },
        use: ["@svgr/webpack"],
      }
    );

    typedFileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
