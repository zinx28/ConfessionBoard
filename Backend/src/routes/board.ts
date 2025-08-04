import type { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { prisma } from "../database/client";
import { getProfileData } from "../utils/tempLogin";

export default function (app: Hono) {
  /*
      Returns data for each id
      */
  app.get("/api/v1/board/user/view/:id", async (c) => {
    try {
      const ID = c.req.param("id");

      if (ID) {
        const Board = await prisma.board.findFirst({
          where: {
            id: ID,
          },
        });

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

      const Account = await prisma.user.findFirst({
        where: {
          token: cookieiei,
        },
      });

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

      const board = await prisma.board.findUnique({
        where: { id: ID },
        select: { allowMultiple: true },
      });

      if (!board) return c.json({ error: "Board not found" }, 404);

      if (!board.allowMultiple) {
        const existingMessage = await prisma.message.findFirst({
          where: {
            userId: AccountData.DiscordID,
            boardId: ID,
          },
        });

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

      const newMessage = await prisma.message.create({
        data: {
          userId: AccountData.DiscordID,
          username: "",
          message,
          board: { connect: { id: ID } },
        },
      });

      return c.json({ success: true, message: newMessage });
    } catch (err) { }

    return c.json({
      message: "internal error",
      error: true,
    });
  });
}
