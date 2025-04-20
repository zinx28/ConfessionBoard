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

export async function loadRoutes(dir: string, app: Hono): Promise<void> {
  const routeFiles = fs.readdirSync(dir);

  if (routeFiles) {
    const routePromises = routeFiles.map((file) => {
      const routePath = path.join(dir, file);
      if (fs.lstatSync(routePath).isDirectory()) {
        return loadRoutes(routePath, app);
      } else if (fs.lstatSync(routePath).isFile() && file.endsWith(".ts")) {
        return import(routePath)
          .then((routeModule) => {
            if (routeModule.default) {
              const routes = Array.isArray(routeModule.default)
                ? routeModule.default
                : [routeModule.default];

              routes.forEach((route: Route) => {
                if (routeModule.default) {
                  routeModule.default(app);
                  console.log(`Loaded route ${route.path} from ${file}`);
                }
              });
            }
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
