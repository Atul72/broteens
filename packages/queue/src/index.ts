import { type CrawlJobData } from "@broteens/contracts";
import { Queue } from "bullmq";
import { Redis } from "ioredis";

export const CRAWL_QUEUE_NAME = "BROTEENS_QUEUE";

export function createRedisConnection(): Redis {
  return new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxLoadingRetryTime: 10000,
    enableReadyCheck: false,
  });
}

export function createCrawlQueue(connection = createRedisConnection()) {
  return new Queue<CrawlJobData>(CRAWL_QUEUE_NAME, {
    connection,
    defaultJobOptions: {
      attempts: 2,
      backoff: { type: "exponential", delay: 2_000 },
      removeOnComplete: 100,
      removeOnFail: 500,
    },
  });
}
