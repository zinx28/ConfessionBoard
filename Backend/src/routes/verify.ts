import type { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { prisma } from "../database/client";

export default function (app: Hono) {
  /*
      Verify's the user
      */
  app.post("/api/v1/account/check", async (c) => {
    try {
      const cookieiei = getCookie(c, "auth_token");

      if (cookieiei) {
        const Account = await prisma.user.findFirst({
          where: {
            token: cookieiei,
          },
        });

        console.log(cookieiei);

        if (Account) {
          return c.json({
            DiscordID: Account?.discordId,
            Avatar: Account?.avatar,
            UserName: Account?.username,
          });
        }
      }

      return c.json({
        message: "Failed to find user",
        error: true,
      });
    } catch (err) {}

    return c.json({
      message: "internal error",
      error: true,
    });
  });
}
