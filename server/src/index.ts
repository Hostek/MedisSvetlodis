import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import cors from "cors"
import "dotenv-safe/config.js"
import express from "express"
import session from "express-session"
import RedisStore from "connect-redis"
import Redis from "ioredis"
import "reflect-metadata"
import { buildSchema } from "type-graphql"
import { COOKIE_NAME, isInProduction, TEN_YEARS } from "./constants.js"
import { AppDataSource } from "./DataSource.js"
import { HelloResolver } from "./resolvers/hello.js"
import { UserResolver } from "./resolvers/user.js"
import { MessageResolver } from "./resolvers/message.js"
import { createServer } from "http"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import { WebSocketServer } from "ws"
import { useServer } from "graphql-ws/use/ws"
import { pubSub } from "./pubSub.js"
// import { useServer } from "graphql-ws/dist/use/ws"

await AppDataSource.initialize()

const app = express()
const port = parseInt(process.env.PORT)
const httpServer = createServer(app)

const cors_options = {
    origin: [
        process.env.CLIENT_URL,
        !isInProduction
            ? "https://studio.apollographql.com"
            : process.env.CLIENT_URL,
    ],
    credentials: true,
}

app.use(cors(cors_options))
app.options("*", cors(cors_options))

const redisClient = new Redis.default(process.env.REDIS_URL)
app.set("trust proxy", 1)

// new RedisStore()

// console.log({ isInProduction })

app.use(
    session({
        store: new RedisStore({
            client: redisClient,
            // disableTouch: true,
            // disableTTL: true
        }),
        saveUninitialized: false,
        secret: process.env.COOKIE_SESSION_SECRET,
        resave: false,
        name: COOKIE_NAME,
        cookie: {
            maxAge: TEN_YEARS,
            httpOnly: true,
            secure: isInProduction,
            sameSite: isInProduction ? "none" : "lax",
            // sameSite: "lax",
            // domain: process.env.COOKIE_DOMAIN,
            path: "/",
        },
    }) as any
)

const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: "/graphql",
})

const schema = await buildSchema({
    resolvers: [HelloResolver, UserResolver, MessageResolver],
    validate: false,
    pubSub: pubSub,
})

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer)

const apolloServer = new ApolloServer({
    schema: schema,
    // context: ({ req, res }) => ({
    //     req,
    //     res,
    //     redis: redisClient,
    // }),
    plugins: [
        // Proper shutdown for the HTTP server.
        ApolloServerPluginDrainHttpServer({ httpServer }),

        // Proper shutdown for the WebSocket server.
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose()
                    },
                }
            },
        },
    ],
})

await apolloServer.start()

// apolloServer.applyMiddleware({ app, cors: false })
app.use(
    "/graphql",
    cors<cors.CorsRequest>(cors_options),
    express.json({ limit: "10mb" }),
    expressMiddleware(apolloServer, {
        context: async ({ req, res }) => ({
            req,
            res,
            redis: redisClient,
        }),
    })
)

app.get("/", (_req, res) => {
    return res.send("Hello World!")
})

httpServer.listen(port, () => {
    console.log(`Running on port ${port}`)
})
