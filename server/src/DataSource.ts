import * as dotenv from "dotenv"
dotenv.config()

import { DataSource } from "typeorm"
import { User } from "./entities/User.js"
import { Message } from "./entities/Message.js"
import Redis from "ioredis"
import { FriendRequestToken } from "./entities/FriendRequestToken.js"
import { FriendRequests } from "./entities/FriendsRequests.js"
import { Block } from "./entities/Block.js"
import { Channel } from "./entities/Channel.js"

export const AppDataSource = new DataSource({
    type: "postgres",
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    logging: true,
    // synchronize: true,
    migrations: ["dist/migrations/**/*.js"],
    entities: [
        User,
        Message,
        FriendRequestToken,
        FriendRequests,
        Block,
        Channel,
    ],
    host: "localhost",
    port: parseInt(process.env.DB_PORT),
})

export const redisClient = new Redis.default(process.env.REDIS_URL)
