import { RedisPubSub } from "graphql-redis-subscriptions"
import Redis from "ioredis"

export const pubSub = new RedisPubSub({
    publisher: new Redis.default(process.env.REDIS_URL),
    subscriber: new Redis.default(process.env.REDIS_URL),
})
