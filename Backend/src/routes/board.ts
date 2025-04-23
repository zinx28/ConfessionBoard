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
    } catch (err) {}

    return c.json({
      message: "internal error",
      error: true,
    });
  });

  // todo add a check instweasd
  app.post("/api/v1/board/user/message/:id", async (c) => {
    try {
      const ID = c.req.param("id");

      if (ID) {
        const cookieiei = getCookie(c, "auth_token");

        if (cookieiei) {
          const Account = await prisma.user.findFirst({
            where: {
              token: cookieiei,
            },
          });

          console.log(cookieiei);

          var CanSendMessage = false;
          type TempuserData = {
            DiscordID: string;
          };
          var AccountData: TempuserData | null = null;

          if (Account) {
            CanSendMessage = true;
            AccountData = {
              DiscordID: Account.discordId,
            };
          } else {
            var ProfileData = await getProfileData(cookieiei, true);

            if (ProfileData) {
              var [discordID, UserData] = ProfileData;

              AccountData = {
                DiscordID: discordID,
              };
            }
          }

          if (AccountData) {
            const { message } = await c.req.json();

            if (message) {
              const newMessage = await prisma.message.create({
                data: {
                  userId: AccountData.DiscordID,
                  username: "",
                  message: message,
                  board: {
                    connect: { id: ID },
                  },
                },
              });
              if (newMessage) {
                

                return c.json({
                  message: "Sent message!",
                  error: false,
                });
              }
            }
          }
        }
      }

      return c.json({
        message: "Failed to find board",
        error: true,
      });
    } catch (err) {}

    return c.json({
      message: "internal error",
      error: true,
    });
  });
}
