import { config, z } from "zod";

export const renderJavascriptSchema = z.enum(["auto", "always", "never"]);

export const crawlConfigSchema = z.object({
  url: z.url({ protocol: /^https?$/ }),
  maxPages: z.coerce.number().int().min(1).max(10000000).default(100),
  maxDepth: z.coerce.number().int().min(1).max(20000).default(10),
  followSubdomains: z.boolean().default(false),
  includeLinks: z.boolean().default(true),
  includeImages: z.boolean().default(false),
  useMainContentOnly: z.boolean().default(true),
  renderJavaScript: renderJavascriptSchema.default("auto"),
  respectRobotsTxt: z.boolean().default(true),
  requestTimeoutMs: z.coerce
    .number()
    .int()
    .min(1000)
    .max(120000)
    .default(30000),
  minContentCharacters: z.coerce.number().int().min(0).max(10_000).default(200),
  allowPatterns: z.array(z.string().min(1)).max(50).default([]),
  denyPatterns: z.array(z.string().min(1)).max(50).default([]),
});

export type CrawlConfig = z.infer<typeof crawlConfigSchema>;

export const crawlJobDataSchema = z.object({
  crawlId: z.uuid(),
  config: crawlConfigSchema,
});

export type CrawlJobData = z.infer<typeof crawlJobDataSchema>;

export const crawlStatus = [
  "queued",
  "running",
  "completed",
  "failed",
  "cancelled",
] as const;

export type CrawlStatus = (typeof crawlStatus)[number];

export const pageStatus = [
  "pending",
  "completed",
  "failed",
  "skipped",
] as const;

export type PageStatus = (typeof pageStatus)[number];
