import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { minimatch } from "minimatch";
import { getDomain } from "tldts";

const TRACKING_PARAMETERS = new Set([
  "fbclid",
  "gclid",
  "mc_cid",
  "mc_eid",
  "ref",
  "referrer",
]);

function isTrackingParameter(name: string): boolean {
  return (
    name.toLowerCase().startsWith("utm_") ||
    TRACKING_PARAMETERS.has(name.toLowerCase())
  );
}

export function normalizeUrl(input: string): string {
  const url = new URL(input);
  url.hash = "";
  url.hostname = url.hostname.toLowerCase();

  for (const key of [...url.searchParams.keys()]) {
    if (isTrackingParameter(key)) url.searchParams.delete(key);
  }
  url.searchParams.sort();

  if (url.pathname.length > 1) {
    url.pathname = url.pathname.replace(/\/+$/, "");
  }

  if (
    (url.protocol === "https:" && url.port === "443") ||
    (url.protocol === "http:" && url.port === "80")
  ) {
    url.port = "";
  }

  return url.toString();
}

export function isInternalUrl(
  candidate: string,
  seedUrl: string,
  followSubdomains: boolean,
): boolean {
  const candidateHost = new URL(candidate).hostname.toLowerCase();
  const seedHost = new URL(seedUrl).hostname.toLowerCase();

  if (!followSubdomains) return candidateHost === seedHost;

  const candidateDomain = getDomain(candidateHost);
  const seedDomain = getDomain(seedHost);
  return Boolean(
    candidateDomain && seedDomain && candidateDomain === seedDomain,
  );
}

export function matchesUrlPatterns(
  url: string,
  allowPatterns: string[],
  denyPatterns: string[],
): boolean {
  if (denyPatterns.some((pattern) => minimatch(url, pattern))) return false;
  return (
    allowPatterns.length === 0 ||
    allowPatterns.some((pattern) => minimatch(url, pattern))
  );
}

function isPrivateIpv4(address: string): boolean {
  const octets = address.split(".").map(Number);
  const first = octets[0] ?? -1;
  const second = octets[1] ?? -1;

  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168) ||
    first >= 224
  );
}

function isPrivateIpv6(address: string): boolean {
  const value = address.toLowerCase();
  if (value === "::" || value === "::1") return true;
  if (
    value.startsWith("fc") ||
    value.startsWith("fd") ||
    value.startsWith("fe8") ||
    value.startsWith("fe9") ||
    value.startsWith("fea") ||
    value.startsWith("feb")
  ) {
    return true;
  }
  if (value.startsWith("::ffff:")) {
    const mapped = value.slice("::ffff:".length);
    return isIP(mapped) === 4 && isPrivateIpv4(mapped);
  }
  return false;
}

export function isPrivateIp(address: string): boolean {
  const version = isIP(address);
  if (version === 4) return isPrivateIpv4(address);
  if (version === 6) return isPrivateIpv6(address);
  return true;
}

export async function assertPublicHttpUrl(input: string): Promise<URL> {
  const url = new URL(input);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http and https URLs are supported");
  }
  if (url.username || url.password) {
    throw new Error("URLs containing credentials are not allowed");
  }

  const hostname = url.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    throw new Error("Localhost URLs are not allowed");
  }

  if (isIP(hostname)) {
    if (isPrivateIp(hostname))
      throw new Error("Private or reserved IP addresses are not allowed");
    return url;
  }

  const addresses = await lookup(hostname, { all: true, verbatim: true });
  if (addresses.length === 0) throw new Error("The hostname did not resolve");
  if (addresses.some(({ address }) => isPrivateIp(address))) {
    throw new Error(
      "The hostname resolves to a private or reserved IP address",
    );
  }

  return url;
}
