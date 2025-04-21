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

      const Account = await prisma.user.findFirst({
        where: {
          token: cookieiei,
        },
      });

      if (Account) {
        return c.json({
          DiscordID: Account?.discordId,
          Avatar: Account?.avatar,
          UserName: Account?.username,
        });
      }

      console.log(cookieiei);

      return c.body("d");
    } catch (err) {}
    return c.body("s");
  });
}
