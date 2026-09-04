import type { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { db } from "../database/client.ts";
import { getProfileData } from "../utils/tempLogin";
import { getUserByTokenD } from "../database/users.ts";
import { getBoardAllowMultiple, getBoardById, getBoardMessagesByUser } from "../database/boards.ts";

export default function (app: Hono) {
  /*
      Returns data for each id
      */
  app.get("/api/v1/board/user/view/:id", async (c) => {
    try {
      const ID = c.req.param("id");

      if (ID) {
        const Board = await getBoardById(ID);

        if (Board) {
          return c.json({
            message: "",
            data: Board,
            error: false,
          });
        }
      }

      return c.json({
        message: "Failed to find board",
        error: true,
      });
    } catch (err) { }

    return c.json({
      message: "internal error",
      error: true,
    });
  });

  // todo add a check instweasd
  app.post("/api/v1/board/user/message/:id", async (c) => {
    try {
      const ID = c.req.param("id");
      var CanSendMessage = false;
      var AccountData: {
        DiscordID: string;
      } | null = null;

      if (!ID) return c.json({ error: "Board ID missing" }, 400);

      const cookieiei = getCookie(c, "auth_token");

      if (!cookieiei) return c.json({ error: "Missing auth token" }, 401);

      const Account = await await getUserByTokenD(cookieiei);

      if (Account) {
        CanSendMessage = true;
        AccountData = {
          DiscordID: Account.discordId,
        };
      } else {
        var ProfileData = await getProfileData(cookieiei, true);

        if (ProfileData) {
          var [discordID] = ProfileData;

          AccountData = {
            DiscordID: discordID,
          };
        }
      }

      if (!AccountData) return c.json({ error: "User not authenticated" }, 401);

      const board = await getBoardAllowMultiple(ID);

      if (!board) return c.json({ error: "Board not found" }, 404);

      if (!board.allowMultiple) {
        const existingMessage = await getBoardMessagesByUser(ID, AccountData.DiscordID);

        if (existingMessage) {
          return c.json(
            { error: "You’ve already sent a message to this board." },
            403
          );
        }
      }

      const { message } = await c.req.json();

      if (!message || message.trim() === "") {
        return c.json({ error: "Message is empty" }, 400);
      }

      const result = await db.query(
        `INSERT INTO messages (
        user_id,
        username,
        message,
        board_id
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
        [
          AccountData.DiscordID,
          "",
          message,
          ID
        ]
      );

      const newMessage = result.rows[0];

      return c.json({ success: true, message: newMessage });
    } catch (err) { console.log(err) }

    return c.json({
      message: "internal error",
      error: true,
    });
  });
}
