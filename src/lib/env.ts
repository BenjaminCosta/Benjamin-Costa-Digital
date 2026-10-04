import "server-only";

export const env = Object.freeze({
  siteUrl: process.env.SITE_URL ?? "http://localhost:3000",
});
