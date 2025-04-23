import type { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { prisma } from "../database/client";

export default function (app: Hono) {
  /*
      Create a new board, temp code
      */
  app.post("/api/v1/board/new", async (c) => {
    try {
      const cookieiei = getCookie(c, "auth_token");

      const Account = await prisma.user.findFirst({
        where: {
          token: cookieiei,
        },
      });

      if (Account) {
        const { title, description } = await c.req.json();

        const newBoard = await prisma.board.create({
          data: {
            title: title,
            description: description,
            ownerId: Account.id,
            anonymous: true,
            theme: "dark",
            allowMultiple: false,
            background: "",
          },
        });

        if (newBoard) {
          c.json({
            message: "created board!",
            error: false,
          });
        }
      }

      console.log(cookieiei);

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

  // View all boards from the user
  app.post("/api/v1/board/view", async (c) => {
    try {
      const cookieiei = getCookie(c, "auth_token");

      const Account = await prisma.user.findFirst({
        where: {
          token: cookieiei,
        },
        include: {
          boards: {
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
        },
      });

      if (Account) {
        return c.json(Account.boards);
      }
    } catch (err) {}

    return c.json([]);
  });

    // View all boards from the user
    app.post("/api/v1/board/view/:id", async (c) => {
      try {
        const cookieiei = getCookie(c, "auth_token");
        const IdValue = c.req.param("id")
  
        const Account = await prisma.user.findFirst({
          where: {
            token: cookieiei,
          },
          include: {
            boards: {
              include: {
                messages: true
              }
            }
          },
        });
  
        if (Account) {
          const FindCertainID = Account.boards.find((e) => e.id == IdValue);
          if(FindCertainID)
          {
            return c.json({
              title: FindCertainID.title,
              messages: FindCertainID.messages
            });
          }
        }
      } catch (err) {}
  
      return c.json({
        message: "internal error",
        error: true,
      });
    });
}
