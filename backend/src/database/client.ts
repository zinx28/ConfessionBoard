import { Pool } from "pg";

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const connectDatabase = async () => {
  try {
    await db.query("SELECT 1");
    console.log("Connected to the database");
  }
  catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};