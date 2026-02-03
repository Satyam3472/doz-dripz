import Database from 'better-sqlite3'
import path from 'path'

import fs from 'fs'

const dbPath = path.join(process.cwd(), 'data', 'app.db')
const dbDir = path.dirname(dbPath)

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new Database(dbPath)

// Enable important pragmas
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// USERS TABLE FOR AUTHENTICATION PURPOSE.
// USERS TABLE FOR AUTHENTICATION PURPOSE.
// Migration check: If table exists but has old schema (no first_name), drop it.
try {
  const tableInfo = db.prepare("PRAGMA table_info(users)").all() as any[];
  // Check if table exists (length > 0) and looks like the old one (has 'name' but not 'first_name')
  const hasName = tableInfo.some(col => col.name === 'name');
  const hasFirstName = tableInfo.some(col => col.name === 'first_name');

  if (tableInfo.length > 0 && hasName && !hasFirstName) {
    console.log('Detected old users schema. Dropping tables to recreate...');
    db.pragma('foreign_keys = OFF'); // Disable FKs to allow dropping
    db.exec('DROP TABLE IF EXISTS order_items');
    db.exec('DROP TABLE IF EXISTS orders');
    db.exec('DROP TABLE IF EXISTS users');
    db.pragma('foreign_keys = ON');
  }
} catch (error) {
  console.error('Error checking schema:', error);
}

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`)

// SESSIONS TABLE FOR AUTHENTICATION
db.exec(`
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`)

// TRACKS TABLE TO STORE THE TRACKS INFORMATION.
db.exec(`
CREATE TABLE IF NOT EXISTS tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  duration INTEGER,
  bpm INTEGER,
  tags TEXT, -- JSON array
  thumbnail_url TEXT,
  audio_url TEXT NOT NULL,
  price REAL NOT NULL,
  featured INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`)

// LICENSES TABLE FOR LICENSING PURPOSE.
db.exec(`
CREATE TABLE IF NOT EXISTS licenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  features TEXT,     -- JSON array
  bulk_deals TEXT,   -- JSON array
  type TEXT NOT NULL
);
`)

// ORDERS TABLE FOR ORDER PURPOSE.
db.exec(`
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  total REAL NOT NULL,
  status TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`)

// ORDER ITEMS TABLE FOR ORDER ITEMS PURPOSE.
db.exec(`
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  track_id INTEGER NOT NULL,
  license_id INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (track_id) REFERENCES tracks(id),
  FOREIGN KEY (license_id) REFERENCES licenses(id)
);
`)

// ---- INDEXES (IMPORTANT for read performance) ----
db.exec(`
CREATE INDEX IF NOT EXISTS idx_tracks_featured ON tracks(featured);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
`)

export default db
