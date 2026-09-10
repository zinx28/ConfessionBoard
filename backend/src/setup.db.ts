import { readFileSync } from "fs";
import { db } from "./database/client.ts";

await db.query(`
    DROP TABLE IF EXISTS messages CASCADE;
    DROP TABLE IF EXISTS boards CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
`);

const schema = readFileSync("./src/database/schema.sql", "utf-8");

await db.query(schema);

console.log("database schema applied");

await db.end();