import type { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { db } from "../database/client.ts";
import { getBoardByUserToken, getBoardMessages, getBoardsByUserToken } from "../database/boards.ts";

export default function (app: Hono) {
  /*
      Create a new board, temp code
      */
  app.post("/api/v1/board/new", async (c) => {
    try {
      const cookieiei = getCookie(c, "auth_token");

      if (cookieiei) {
        const Account = await db.query("SELECT * FROM users WHERE token = $1", [cookieiei]).then((res) => res.rows[0]);

        if (Account) {
          const { title, description, theme} = await c.req.json();

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
            true,
            theme,
            false,
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

      console.log(cookieiei);

      return c.json({
        message: "Failed to find user",
        error: true,
      });
    } catch (err) { console.log(err) }

    return c.json({
      message: "internal error",
      error: true,
    });
  });

  // View all boards from the user
  app.post("/api/v1/board/view", async (c) => {
    try {
      const cookieiei = getCookie(c, "auth_token");

      if (cookieiei) {
        const boards = await getBoardsByUserToken(cookieiei);

        if (boards) {
          return c.json(boards);
        }
      }
    } catch (err) { }

    return c.json([]);
  });

  // View a certain board from the user
  app.post("/api/v1/board/view/:id", async (c) => {
    try {
      const cookieiei = getCookie(c, "auth_token");
      const IdValue = c.req.param("id");

      if (cookieiei) {
        const board = await getBoardByUserToken(cookieiei, IdValue);

        if(board)
        {
          const messages = await getBoardMessages(board.id);

          return c.json({
            title: board.title,
            messages: messages,
          });
        }
      }
    } catch (err) { }

    return c.json({
      message: "internal error",
      error: true,
    });
  });
}
