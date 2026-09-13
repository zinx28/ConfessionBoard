import type { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { db } from "../database/client.ts";
import { getBoardByUserToken, getBoardMessages, getBoardsByUserToken } from "../database/boards.ts";
import { authLimiter, readLimiter } from "../middleware/rateLimiter.ts";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function (app: Hono) {
  /*
      Create a new board, temp code
      */
  app.post("/api/v1/board/new", authLimiter, async (c) => {
    try {
      const cookieiei = getCookie(c, "auth_token");

      if (cookieiei) {
        const Account = await db.query("SELECT * FROM users WHERE token = $1", [cookieiei]).then((res) => res.rows[0]);

        if (Account) {
          const { title, description, theme, allowAnonymous, allowMultiple } = await c.req.json();

          const result = await db.query(
            `INSERT INTO boards (
              title,
              description,
              owner_id,
              anonymous,
              theme,
              allow_multiple,
              background
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING
              id,
              title,
              description,
              owner_id AS "ownerId",
              anonymous,
              theme,
              allow_multiple AS "allowMultiple",
              background`, [
            title,
            description,
            Account.discord_id,
            allowAnonymous,
            theme,
            allowMultiple,
            "",
          ])

          const newBoard = result.rows[0];

          if (newBoard) {
            return c.json({
              message: "created board!",
              id: newBoard.id,
              error: false,
            });
          }
        }
      }

      return c.json({ message: "Not authenticated" }, 401);
    } catch (err) {
      console.error("Failed creating board:", err)
    }

    return c.json({ message: "internal error" }, 500);
  });

  // View all boards from the user
  app.post("/api/v1/board/view", readLimiter, async (c) => {
    try {
      const cookieiei = getCookie(c, "auth_token");

      if (cookieiei) {
        const boards = await getBoardsByUserToken(cookieiei);

        if (boards) {
          return c.json(boards);
        }

        return c.json([])
      }
    } catch (err) {
      console.error("Error fetching boards:", err);
    }

    return c.json({ error: "Not authenticated" }, 401)
  });

  // View a certain board from the user
  app.post("/api/v1/board/view/:id", readLimiter, async (c) => {
    try {
      const cookieiei = getCookie(c, "auth_token");
      const ID = c.req.param("id");

      if (!ID) return c.json({ error: "Board ID missing" }, 400);
      if (!UUID_REGEX.test(ID)) return c.json({ error: "Invaild board id" }, 400)

      if (cookieiei) {
        const board = await getBoardByUserToken(cookieiei, ID);

        if (board) {
          const messages = await getBoardMessages(board.id);

          return c.json({
            title: board.title,
            description: board.description || "",
            messages: messages,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching board:", err);
    }

    return c.json({ message: "Not found or not authorized" }, 404);
  });
}
