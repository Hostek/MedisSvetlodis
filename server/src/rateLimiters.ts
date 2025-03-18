import { RateLimiterRedis } from "rate-limiter-flexible"
import { redisClient } from "./DataSource.js"

export const loginRateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "login_attempts",
    points: 20,
    duration: 15 * 60,
    blockDuration: 60 * 60,
})
