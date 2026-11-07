import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "agent-hub.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  if (DB_PATH !== ":memory:") fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '',
      endpoint TEXT NOT NULL DEFAULT '',
      author TEXT NOT NULL DEFAULT 'anonymous',
      created_at TEXT NOT NULL
    );
  `);
  return db;
}

export function resetDb() {
  if (db) { try { db.close(); } catch {} }
  db = null;
}
