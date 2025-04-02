import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import RedisStore from "connect-redis"
import cors from "cors"
import "dotenv-safe/config.js"
import express from "express"
import session from "express-session"
import { useServer } from "graphql-ws/use/ws"
import { createServer } from "http"
import "reflect-metadata"
import { buildSchema } from "type-graphql"
import { WebSocketServer } from "ws"
import { COOKIE_NAME, isInProduction, TEN_YEARS } from "./constants.js"
import { AppDataSource, redisClient } from "./DataSource.js"
import { pubSub } from "./pubSub.js"
import { generalRateLimiter } from "./rateLimiters.js"
import { FriendRequestsResolver } from "./resolvers/friendRequests.js"
import { FriendRequestTokenResolver } from "./resolvers/friendRequestToken.js"
import { HelloResolver } from "./resolvers/hello.js"
import { MessageResolver } from "./resolvers/message.js"
import { UserResolver } from "./resolvers/user.js"

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

const getClientIdentifier = (req: express.Request): string => {
    // 1. Try standard Express IP (respects 'trust proxy')
    if (req.ip) return req.ip

    // 2. Check X-Forwarded-For header (common proxy header)
    const xForwardedFor = req.headers["x-forwarded-for"]
    if (Array.isArray(xForwardedFor)) {
        return xForwardedFor[0].split(",")[0].trim()
    } else if (typeof xForwardedFor === "string") {
        return xForwardedFor.split(",")[0].trim()
    }

    // 3. Fallback to socket remote address
    if (req.socket.remoteAddress) {
        return req.socket.remoteAddress
    }

    // Cloudflare specific
    const cfConnectingIp = req.headers["cf-connecting-ip"]
    if (typeof cfConnectingIp === "string") {
        return cfConnectingIp
    }

    // 4. Ultimate fallback for rare cases
    return "unknown-ip"
}

const generalLimiterMiddleware = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const clientIp = getClientIdentifier(req)
        await generalRateLimiter.consume(clientIp)
        next()
    } catch (error) {
        res.status(429).json({ error: "Too many requests" })
    }
}

const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: "/graphql",
})

const schema = await buildSchema({
    resolvers: [
        HelloResolver,
        UserResolver,
        MessageResolver,
        FriendRequestTokenResolver,
        FriendRequestsResolver,
    ],
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
    generalLimiterMiddleware,
    cors<cors.CorsRequest>(cors_options),
    express.json({ limit: "10mb" }),
    expressMiddleware(apolloServer, {
        context: async ({ req, res }) => ({
            req,
            res,
            redis: redisClient,
            ip: getClientIdentifier(req),
        }),
    })
)

app.get("/", async (_req, res) => {
    return res.send("Hello World!")
})

httpServer.listen(port, () => {
    console.log(`Running on port ${port}`)
})
