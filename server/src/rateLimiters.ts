import { RateLimiterRedis } from "rate-limiter-flexible"
import { redisClient } from "./DataSource.js"

// General rate limiter for all GraphQL requests
export const generalRateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "graphql_general",
    points: 300, // requests
    duration: 15 * 60, // 15 minutes
    blockDuration: 15 * 60, // Block for 15 minutes if exceeded
})

export const loginRateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "login_attempts",
    points: 20,
    duration: 15 * 60,
    blockDuration: 60 * 60,
})

export const messageRateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "create_message_friend",
    points: 80,
    duration: 60 * 5,
    blockDuration: 60 * 15,
})
