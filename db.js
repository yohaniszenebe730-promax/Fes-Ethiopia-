const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.VERCEL ? '/tmp/fes_bot.db' : './fes_bot.db';

async function initDatabase() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY,
      username TEXT,
      first_name TEXT,
      language TEXT DEFAULT 'en',
      speak_mode INTEGER DEFAULT 0,
      study_mode INTEGER DEFAULT 0,
      joined_at INTEGER,
      last_active INTEGER,
      points INTEGER DEFAULT 0,
      banned INTEGER DEFAULT 0
    );
    
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      type TEXT,
      original_name TEXT,
      stored_name TEXT,
      size INTEGER,
      uploaded_at INTEGER,
      download_count INTEGER DEFAULT 0
    );
    
    CREATE TABLE IF NOT EXISTS broadcasts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT,
      media_type TEXT,
      media_id TEXT,
      scheduled_time INTEGER,
      status TEXT DEFAULT 'pending'
    );
  `);
  
  return db;
}

module.exports = { initDatabase };
