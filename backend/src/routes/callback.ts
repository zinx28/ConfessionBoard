import axios from "axios";
import type { Hono } from "hono";
import { db } from "../database/client.ts";
import { setCookie } from "hono/cookie";
import {
  getProfileData,
  getProfileDataByDscID,
  GlobalCacheProfiles,
} from "../utils/tempLogin";
import { createUser, getUserByDiscordID, updateUserToken } from "../database/users.ts";
import { authLimiter } from "../middleware/rateLimiter.ts";

function setAuthCookie(c: any, token: string) {
  setCookie(c, "auth_token", token, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    domain: process.env.HOST || "127.0.0.1",
    httpOnly: true,
    maxAge: 604800,
    //expires: new Date(Date.now() + 604800000),
    sameSite: process.env.NODE_ENV !== "production" ? "lax" : "none",
  });
}

function respondWithAccount(c: any, account: any) {
  return c.json({
    DiscordID: account?.discord_id,
    Avatar: account?.avatar,
    UserName: account?.username,
  });
}

export default function (app: Hono) {
  app.post("/api/v1/discord", authLimiter, async (c) => {
    try {
      const { code, needAccount } = await c.req.json();
      const CLIENT_ID = process.env.CLIENT_ID;
      const CLIENT_SECRET = process.env.CLIENT_SECRET;

      if(!CLIENT_ID) throw new Error("Missing CLIENT_ID env var")
      if(!CLIENT_SECRET) throw new Error("Missing CLIENT_SECRET env var")

      const params = new URLSearchParams();
      params.append("client_id", CLIENT_ID);
      params.append("client_secret", CLIENT_SECRET);
      params.append("code", code);
      params.append("grant_type", "authorization_code");
      params.append("redirect_uri", process.env.REDIRECT_URI!);

      const response = await axios.post(
        "https://discord.com/api/oauth2/token",
        params.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = response.data.access_token;

      const userResponse = await axios.get(
        "https://discord.com/api/v9/users/@me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const userData = userResponse.data;

      if (userData) {
        //needAccount ~ this can be true or false, if they created a account,
        // then needacc is false, it will use the created account already

        const Account = await getUserByDiscordID(userData.id);
        // todo
        var token = crypto.randomUUID(); // not done... i would like to say

        if (needAccount) {
          if (!Account) {
            await createUser(
              userData.id,
              userData.username,
              token,
              userData.avatar
            )

            console.log("CREATED A ACCOUNT");
          } else
            await updateUserToken(userData.id, token);

          setAuthCookie(c, token);

          return respondWithAccount(c, Account);
        } else {
          var ProfileData = await getProfileDataByDscID(userData.id);

          if (ProfileData) {
            var UserData = GlobalCacheProfiles[userData.id];
            UserData.Token = token;
            UserData.updatedSince = new Date(Date.now() + 15 * 60 * 1000);

            setAuthCookie(c, token);

            return respondWithAccount(c, Account);
          } else {
            GlobalCacheProfiles[userData.id] = {
              Token: token,
              Username: userData.username,
              updatedSince: new Date(Date.now() + 15 * 60 * 1000),
            };

            setAuthCookie(c, token);

            return respondWithAccount(c, Account);
          }
        }
      }
    } catch (err) {
      console.error("Discord auth error:", err);
      return c.json({ error: "Authentication failed" }, 500)
    }

    return c.json({ error: "Authentication failed" }, 500)
  });
}
