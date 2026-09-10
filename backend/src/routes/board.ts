import type { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { db } from "../database/client.ts";
import { getProfileData } from "../utils/tempLogin";
import { getUserByTokenD } from "../database/users.ts";
import { getBoardAllowMultiple, getBoardById, getBoardMessagesByUser } from "../database/boards.ts";
import { messageLimiter, readLimiter } from "../middleware/rateLimiter.ts";

// move this!
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function (app: Hono) {
  /*
      Returns data for each id
      */
  app.get("/api/v1/board/user/view/:id", readLimiter, async (c) => {
    try {
      const ID = c.req.param("id");

      if (!ID) return c.json({ error: "Board id missing" }, 400);
      if (!UUID_REGEX.test(ID)) return c.json({ error: "Invaild board id" }, 400)

      const Board = await getBoardById(ID);

      if (!Board) return c.json({ error: "Board not found" }, 404)

      return c.json({
        data: Board,
      });
    } catch (err) {
      console.error("Error fetching board:", err);
    }

    return c.json({ message: "internal error" }, 500);
  });

  // todo add a check instweasd
  app.post("/api/v1/board/user/message/:id", messageLimiter, async (c) => {
    try {
      const ID = c.req.param("id");
      let CanSendMessage = false;
      let AccountData: {
        DiscordID: string;
      } | null = null;

      if (!ID) return c.json({ error: "Board ID missing" }, 400);
      if (!UUID_REGEX.test(ID)) return c.json({ error: "Invaild board id" }, 400)

      const cookieiei = getCookie(c, "auth_token");

      if (!cookieiei) return c.json({ error: "Missing auth token" }, 401);

      const Account = await getUserByTokenD(cookieiei);

      if (Account) {
        CanSendMessage = true;
        AccountData = {
          DiscordID: Account.discordId,
        };
      } else {
        const ProfileData = await getProfileData(cookieiei, true);

        if (ProfileData) {
          const [discordID] = ProfileData;

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

      if (message.length > 2000) {
        return c.json({ error: "Message is too long" }, 400)
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
    } catch (err) {
      console.error("Error posting message:", err);
    }

    return c.json({ message: "internal error" }, 500);
  });
}
