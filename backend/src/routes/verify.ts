import type { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { db } from "../database/client.ts";
import { getProfileData } from "../utils/tempLogin";
import { authLimiter } from "../middleware/rateLimiter.ts";

export default function (app: Hono) {
  /*
      Verify's the user
      */
  app.post("/api/v1/account/check", authLimiter, async (c) => {
    try {
      const cookieiei = getCookie(c, "auth_token");

      if (cookieiei) {
        const Account = await db.query("SELECT * FROM users WHERE token = $1", [cookieiei]).then((res) => res.rows[0]);

        if (Account) {
          return c.json({
            DiscordID: Account?.discord_id,
            Avatar: Account?.avatar,
            UserName: Account?.username,
            Temp: false
          });
        } else {
          // limited access

          const ProfileData = await getProfileData(cookieiei, true);

          if (ProfileData) {
            const [discordID, UserData] = ProfileData;

            return c.json({
              DiscordID: discordID,
              Avatar: "",
              UserName: UserData?.Username,
              Temp: true
            });
          }
        }
      }

      return c.json({ error: "Not authenticated" }, 401)
    } catch (err) {
      console.error("Error checking account:", err);
    }

    return c.json({ message: "internal error" }, 500);
  });
}
