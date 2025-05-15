import cookie from "cookie"
import signature from "cookie-signature"
import { COOKIE_NAME } from "../constants.js"
import { redisClient } from "../DataSource.js"

const unsign = signature.unsign

export const getSessionFromCookie = async (
    rawCookieHeader: string | undefined
) => {
    if (!rawCookieHeader) return null

    const cookies = cookie.parse(rawCookieHeader)
    const signedSessionId = cookies[COOKIE_NAME]

    if (!signedSessionId || !signedSessionId.startsWith("s:")) return null

    const sid = unsign(
        signedSessionId.slice(2),
        process.env.COOKIE_SESSION_SECRET!
    )
    if (!sid) return null

    const sessionId = `sess:${sid}`

    try {
        const sessionData = await redisClient.get(sessionId)
        if (!sessionData) return null
        return JSON.parse(sessionData)
    } catch {
        return null
    }
}
