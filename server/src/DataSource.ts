import { DataSource } from "typeorm"
import { User } from "./entities/User.js"
import { Message } from "./entities/Message.js"

export const AppDataSource = new DataSource({
    type: "postgres",
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    logging: true,
    synchronize: true,
    entities: [User, Message],
    host: "localhost",
    port: parseInt(process.env.DB_PORT),
})
