import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

let db: Database | undefined;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: process.env.PATH_TO_DB || "dev.db",
      driver: sqlite3.Database,
    });
    await db.migrate();
  }
  return db;
}
