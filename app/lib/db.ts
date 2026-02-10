import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');

const db = new sqlite3.Database(dbPath);

export function dbRun(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function dbGet<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T);
    });
  });
}

export function dbAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
}

let isInitialized = false;

export async function initDB() {
  if (isInitialized) return;

  await dbRun('PRAGMA foreign_keys = ON');

  await dbRun(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      picture TEXT,
      isAdmin INTEGER DEFAULT 0
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS post (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      content TEXT NOT NULL,
      image TEXT,
      creationDate TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS comment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      postId INTEGER NOT NULL,
      content TEXT NOT NULL,
      creationDate TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
      FOREIGN KEY (postId) REFERENCES post(id) ON DELETE CASCADE
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS follow (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      followerId INTEGER NOT NULL,
        UNIQUE(userId, followerId),
        FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (followerId) REFERENCES user(id) ON DELETE CASCADE
      )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS "like" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      postId INTEGER NOT NULL,
      UNIQUE(userId, postId),
      FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
      FOREIGN KEY (postId) REFERENCES post(id) ON DELETE CASCADE
    )
  `);

  isInitialized = true;
  console.log('Base de données initialisée');
}

initDB().catch(err => {
  console.error('Erreur initialisation DB:', err);
});

export { db };