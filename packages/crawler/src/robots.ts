import robotsParser, { type Robot } from "robots-parser";

export const CRAWLER_USER_AGENT = "CrawlerPlatformBot/0.1";
const parseRobots = robotsParser as unknown as (
  url: string,
  contents: string,
) => Robot;

export async function loadRobotsRules(
  seedUrl: string,
  enabled: boolean,
): Promise<Robot | null> {
  if (!enabled) return null;

  const robotsUrl = new URL("/robots.txt", seedUrl).toString();
  try {
    const response = await fetch(robotsUrl, {
      headers: { "user-agent": CRAWLER_USER_AGENT },
      signal: AbortSignal.timeout(10_000),
      redirect: "error",
    });
    if (!response.ok) return null;
    return parseRobots(robotsUrl, await response.text());
  } catch {
    // A missing or unreachable robots.txt is treated as no crawl restriction.
    return null;
  }
}

export function isAllowedByRobots(robots: Robot | null, url: string): boolean {
  return robots?.isAllowed(url, CRAWLER_USER_AGENT) !== false;
}
