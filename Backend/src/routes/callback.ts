import axios from "axios";
import type { Hono } from "hono";
import { prisma } from "../database/client";
import { setCookie } from "hono/cookie";

export default function (app: Hono) {
  app.post("/api/v1/discord", async (c) => {
    try {
      const { code, needAccount } = await c.req.json();

      console.log(code);
      const params = new URLSearchParams();
      params.append("client_id", process.env.CLIENT_ID!);
      params.append("client_secret", process.env.CLIENT_SECRET!);
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

      console.log(userData);

      if (userData) {
        //needAccount ~ this can be true or false, if they created a account,
        // then needacc is false, it will use the created account already

        const Account = await prisma.user.findFirst({
          where: {
            discordId: userData.id,
          },
        });

        // todo
        var token = Bun.password.hashSync(userData.id, {
          algorithm: "bcrypt",
          cost: 4,
        });

        if (needAccount) {
          if (!Account) {
            await prisma.user.create({
              data: {
                discordId: userData.id,
                username: userData.username,
                token: token,
                avatar: userData.avatar,
              },
            });
            console.log("CREATED A ACCOUNT");
          } else {
            await prisma.user.update({
              where: {
                discordId: userData.id,
              },
              data: {
                token: token,
              }
            })
            console.log("FOUND A ACCOUNTHAHAHAH!!");
          }

          setCookie(c, "auth_token", token, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            domain: process.env.HOST || "localhost", 
            httpOnly: true,
            maxAge: 604800,
            expires: new Date(Date.now() + 604800000),
            sameSite: "Lax",
          });

          return c.json({
            DiscordID: Account?.discordId,
            Avatar: Account?.avatar,
            UserName: Account?.username
          })
        }

       
      }
    } catch (err) {
      console.error(err);
    }
    return c.body("hi");
  });
}
