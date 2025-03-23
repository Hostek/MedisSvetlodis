import { DataSource } from "typeorm"
import { User } from "./entities/User.js"
import { Message } from "./entities/Message.js"
import Redis from "ioredis"
import { FriendRequestToken } from "./entities/FriendRequestToken.js"

export const AppDataSource = new DataSource({
    type: "postgres",
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    logging: true,
    synchronize: true,
    entities: [User, Message, FriendRequestToken],
    host: "localhost",
    port: parseInt(process.env.DB_PORT),
})

export const redisClient = new Redis.default(process.env.REDIS_URL)
