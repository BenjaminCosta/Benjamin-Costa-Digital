// Shared by the form and server. DNS/connection validation stays server-only.
export function normaliseBusinessLink(input: string): string {
  const value = input.trim();
  if (!value || value.startsWith("//") || value.length > 2048 || /[\s\\\u0000-\u001f\u007f]/u.test(value)) {
    throw new Error("Paste a valid public business link.");
  }
  const withProtocol = /^[a-z][a-z\d+.-]*:/i.test(value)
    ? value
    : `https://${value}`;
  let url: URL;
  try {
    url = new URL(withProtocol);
  } catch {
    throw new Error("Paste a valid public business link.");
  }
  const host = url.hostname.toLowerCase();
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username || url.password || url.port ||
    !host.includes(".") || host.length > 253 ||
    !/^[a-z\d.-]+$/.test(host) || /^[\d.]+$/.test(host) ||
    host.split(".").some((part) => !part || part.length > 63 || part.startsWith("-") || part.endsWith("-")) ||
    /(?:^|\.)(?:localhost|local|internal|test|invalid|onion)$/.test(host)
  ) {
    throw new Error("Use a public business website without login details or a custom port.");
  }
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (/^(utm_|fbclid$|gclid$)/i.test(key)) url.searchParams.delete(key);
  }
  return url.toString();
}

export function isSocialBusinessLink(link: string): boolean {
  const host = new URL(link).hostname;
  return /(?:^|\.)(?:instagram\.com|google\.[a-z.]+|goo\.gl|g\.page)$/.test(host) || host === "maps.app.goo.gl";
}
