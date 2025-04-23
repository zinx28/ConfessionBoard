import type { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { prisma } from "../database/client";

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
}
