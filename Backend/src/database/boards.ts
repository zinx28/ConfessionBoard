import { db } from "./client.ts";

export async function getBoardsByUserToken(token: string) {
    const resullt = await db.query(
        `SELECT id, title, description 
        FROM boards
        WHERE owner_id = (
            SELECT discord_id FROM users WHERE token = $1
        )`,
        [token]
    );
    return resullt.rows;
}

export async function getBoardByUserToken(token: string,boardId: string) {
    const result = await db.query(
        `SELECT b.id, b.title
        FROM boards b
        INNER JOIN users u ON b.owner_id = u.discord_id
        WHERE u.token = $1 AND b.id = $2
        LIMIT 1`,
        [token, boardId]
    );
    return result.rows[0] ?? null;
}

export async function getBoardMessages(boardId: string) {
    const result = await db.query(
        `SELECT *
        FROM messages
        WHERE board_id = $1
        ORDER BY timestamp ASC`,
        [boardId]
    );
    return result.rows ?? [];
}

export async function getBoardMessagesByUser(boardId: string, userId: string) {
    const result = await db.query(
        `SELECT *
        FROM messages
        WHERE board_id = $1 AND user_id = $2
        ORDER BY timestamp ASC`,
        [boardId, userId]
    );
    return result.rows[0] ?? null;
}

export async function getBoardById(boardId: string) {
    const result = await db.query(
        `SELECT *
        FROM boards
        WHERE id = $1
        LIMIT 1`,
        [boardId]
    );
    return result.rows[0] ?? null;
}

export async function getBoardAllowMultiple(boardId: string) {
    const result = await db.query(
        `SELECT allow_multiple
        FROM boards
        WHERE id = $1
        LIMIT 1`,
        [boardId]
    );
    return result.rows[0] ?? null;
}