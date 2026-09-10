import { Hono } from "hono";
import * as fs from "fs";
import * as path from "path";

interface Route {
  register?: (app: Hono) => void;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | string;
  description: string;
  public: boolean;
}

/**
 * Load all TypeScript route files from the specified directory.
 * 
 * @param dir Directory to load routes from
 * @param app Hono application instance
 */
export async function loadRoutes(dir: string, app: Hono): Promise<void> {
  const routeFiles = fs.readdirSync(dir);

  if (routeFiles) {
    const routePromises = routeFiles.map((file) => {
      const routePath = path.join(dir, file);
      const stat = fs.lstatSync(routePath);

      if (stat.isDirectory()) {
        return loadRoutes(routePath, app);
      }

      if (stat.isFile() && file.endsWith(".ts")) {
        return import(routePath)
          .then((routeModule) => {

            if (typeof routeModule.default === "function") {
              routeModule.default(app);
              console.log(`Loaded routes from ${file}`);
            } 
            else console.warn(`No default export function in ${file}`)
          })
          .catch((err) => {
            console.error(`Failed to load route ${file}:`, err);
          });
      }

      return Promise.resolve();
    });

    await Promise.all(routePromises);
  }
}
