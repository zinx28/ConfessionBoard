import { rateLimiter } from "hono-rate-limiter";

/**
 * Determines the key used to track request counts.
 * Falls back if not found
 * since req.ip isn't reliably available behind a reverse proxy/CDN.
 * */
function keyFromRequest(c: any): string {
    return (
        c.req.header("cf-connecting-ip") ?? // cloudflare connecting ip
        c.req.header("x-forwarded-for") ??
        "anonymous" // shared bucket
    )
}

/**
 * Strict limited for posting confessions!!!
 * windowMs: the amount of time window, in ms, that requests are counted over (1 minute)
 * limit: max request allowed per key within that window
 * keyGenerator: how to identify "hwo" is making the request (see above)
 */
export const messageLimiter = rateLimiter({
    windowMs: 60 * 1000,
    limit: 5,
    keyGenerator: keyFromRequest
})

/**
 * Limiter for auth/login attempts (e.g Discord OAuth exchange)
 * (expired code, network issues) are normally more commmon here
 */
export const authLimiter = rateLimiter({
    windowMs: 60 * 1000,
    limit: 15,
    keyGenerator: keyFromRequest
})

/**
 * Loose limiter for read-only endpoints (e.g, viewing a board.)
 * GET's are cheap and legitmate usage can hit these often
 * so this mainly just stops "bots" perhaps than normal traffic.
 */
export const readLimiter = rateLimiter({
    windowMs: 60 * 1000,
    limit: 60,
    keyGenerator: keyFromRequest
})