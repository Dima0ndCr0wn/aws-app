import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export const db: Promise<Database<sqlite3.Database, sqlite3.Statement>> = open({
  filename: './data/finance.db',
  driver: sqlite3.Database
});

// Inicializar la base de datos (crear tablas si no existen)
(async () => {
  const database = await db;
  
  await database.run(`
    CREATE TABLE IF NOT EXISTS incomes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      concept TEXT NOT NULL,
      amount REAL NOT NULL
    )
  `);

  await database.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      concept TEXT NOT NULL,
      amount REAL NOT NULL
    )
  `);

  await database.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      date TEXT NOT NULL
    )
  `);
})();
