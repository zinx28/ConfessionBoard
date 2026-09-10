import { db } from "./client.ts";

/**
 * Loads every boards from a specific user
 * 
 * @param token Users Token
 * @returns Boards
 */
export async function getBoardsByUserToken(token: string) {
    const resullt = await db.query(
        `SELECT 
            id, 
            title, 
            description,
            (
                SELECT COUNT(*)
                FROM messages
                WHERE messages.board_id = boards.id
            )::int AS message_count
        FROM boards
        WHERE owner_id = (
            SELECT discord_id FROM users WHERE token = $1
        )`,
        [token]
    );
    return resullt.rows;
}

/**
 * Loads a board from a specific user
 * 
 * @param token Users Token
 * @param boardId Board ID
 * @returns Board
 */
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

/**
 * Gets the boards messages from boardID
 * 
 * @param boardId Board ID
 * @returns 
 */
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

/**
 * Gets the board messages from a user
 * 
 * @param boardId Board ID
 * @param userId  User ID
 * @returns 
 */
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

/**
 * Gets board by id
 * 
 * @param boardId Board ID
 * @returns 
 */
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

/**
 * Gets board with "allow_multiple" tag
 * 
 * @param boardId Board ID
 * @returns 
 */
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