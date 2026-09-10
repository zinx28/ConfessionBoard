import { Hono } from "hono";
import { logger } from "hono/logger";
import { connectDatabase } from "./database/client.ts";
import dotenv from 'dotenv';
import path from "path";
import { loadRoutes } from "./utils/routing";
import { cors } from "hono/cors";
dotenv.config();

const app = new Hono();
async function StartServer() {
  app.use(logger());

  app.use(cors({
    origin: 'http://127.0.0.1:3000',
    allowMethods: ['GET', 'OPTIONS', 'POST'], 
    //exposeHeaders: ['Content-Type'],
    credentials: true
  }));

  await connectDatabase();
  await loadRoutes(path.join(__dirname, "./routes"), app)
  
  app.all("*", (c) => {
    return c.html(
      '<h1>Not Found <a style="text-decortation: none;" href="/">/</a></h1>'
    );
  });
  
  Bun.serve({
    fetch: app.fetch,
    port: process.env.PORT,
  });
}

StartServer();

export default app;
