import { db } from "./client.ts";

export async function getUserByDiscordID(discordId: string) {
    return db.query(`
        SELECT * FROM users WHERE discord_id = $1 LIMIT 1`,
        [discordId]
    ).then((res) => res.rows[0] ?? null);
}

export async function getUserByTokenD(token: string) {
    return db.query(`
        SELECT * FROM users WHERE token = $1 LIMIT 1`,
        [token]
    ).then((res) => res.rows[0] ?? null);
}

export async function createUser(
    discordId: string,
    username: string,
    token: string,
    avatar: string
) {
    return db.query(`
        INSERT INTO users (discord_id, username, token, avatar)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [discordId, username, token, avatar]
    ).then((res) => res.rows[0]);
}

export async function updateUserToken(discordId: string, newToken: string) {
    return db.query(`
        UPDATE users SET token = $1 WHERE discord_id = $2 RETURNING *`,
        [newToken, discordId]
    ).then((res) => res.rows[0]);
}