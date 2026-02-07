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
  isVerified INTEGER DEFAULT 0,
  verificationToken TEXT,
  verificationTokenExpires DATETIME,
  resetPasswordToken TEXT,
  resetPasswordTokenExpires DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`)

// Migration: Add isVerified column if missing
try {
  const tableInfo = db.prepare("PRAGMA table_info(users)").all() as any[];
  const hasIsVerified = tableInfo.some(col => col.name === 'isVerified');

  if (!hasIsVerified) {
    console.log('Migrating users table: Adding verification columns...');
    db.exec('ALTER TABLE users ADD COLUMN isVerified INTEGER DEFAULT 0;');
    db.exec('ALTER TABLE users ADD COLUMN verificationToken TEXT;');
    db.exec('ALTER TABLE users ADD COLUMN verificationTokenExpires DATETIME;');
  }

  const hasResetToken = tableInfo.some(col => col.name === 'resetPasswordToken');
  if (!hasResetToken) {
    console.log('Migrating users table: Adding reset password columns...');
    db.exec('ALTER TABLE users ADD COLUMN resetPasswordToken TEXT;');
    db.exec('ALTER TABLE users ADD COLUMN resetPasswordTokenExpires DATETIME;');
  }
} catch (error) {
  console.error('Error migrating users schema:', error);
}

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

// PAYMENTS TABLE (Razorpay)
db.exec(`
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  razorpayOrderId TEXT NOT NULL,
  razorpayPaymentId TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
`)

// PURCHASES TABLE
db.exec(`
CREATE TABLE IF NOT EXISTS purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  trackId TEXT NOT NULL,
  trackName TEXT NOT NULL,
  licenseType TEXT NOT NULL,
  amount INTEGER NOT NULL,
  fileUrl TEXT NOT NULL,
  invoiceUrl TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
`)

// Migration: Add new columns to purchases if missing
try {
  const tableInfo = db.prepare("PRAGMA table_info(purchases)").all() as any[];
  const hasTrackName = tableInfo.some(col => col.name === 'trackName');

  if (!hasTrackName && tableInfo.length > 0) {
    console.log('Migrating purchases table: Adding new columns...');
    db.exec('ALTER TABLE purchases ADD COLUMN trackName TEXT DEFAULT "Unknown Track";');
    db.exec('ALTER TABLE purchases ADD COLUMN fileUrl TEXT DEFAULT "";');
    db.exec('ALTER TABLE purchases ADD COLUMN invoiceUrl TEXT;');
  }
} catch (error) {
  console.error('Error migrating purchases schema:', error);
}

// ---- ADMIN DASHBOARD UPDATES ----

// 1. Update USERS table with ROLE
try {
  const tableInfo = db.prepare("PRAGMA table_info(users)").all() as any[];
  const hasRole = tableInfo.some(col => col.name === 'role');
  if (!hasRole) {
    console.log('Migrating users table: Adding role column...');
    db.exec("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'USER';");
  }
} catch (error) {
  console.error('Error migrating users schema (role):', error);
}

// 2. Update TRACKS table (key, status, updated_at)
try {
  const tableInfo = db.prepare("PRAGMA table_info(tracks)").all() as any[];
  const hasKey = tableInfo.some(col => col.name === 'key');
  const hasStatus = tableInfo.some(col => col.name === 'status');
  const hasUpdatedAt = tableInfo.some(col => col.name === 'updated_at');

  if (!hasKey) db.exec("ALTER TABLE tracks ADD COLUMN key TEXT;");
  if (!hasStatus) db.exec("ALTER TABLE tracks ADD COLUMN status TEXT DEFAULT 'ACTIVE';"); // ACTIVE, PRIVATE
  if (!hasUpdatedAt) db.exec("ALTER TABLE tracks ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;");
} catch (error) {
  console.error('Error migrating tracks schema:', error);
}

// 3. Create TRACK_LICENSES table
db.exec(`
    CREATE TABLE IF NOT EXISTS track_licenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trackId INTEGER NOT NULL,
        licenseType TEXT NOT NULL, -- MP3, WAV, STEMS, UNLIMITED, EXCLUSIVE
        price REAL NOT NULL,
        isActive INTEGER DEFAULT 1,
        contractFeatures TEXT, -- JSON array
        FOREIGN KEY (trackId) REFERENCES tracks(id) ON DELETE CASCADE
    );
`);

// Migration: Add contractFeatures if missing
try {
  const tableInfo = db.prepare("PRAGMA table_info(track_licenses)").all() as any[];
  const hasFeatures = tableInfo.some(col => col.name === 'contractFeatures');
  if (!hasFeatures) {
    console.log('Migrating track_licenses: Adding contractFeatures...');
    db.exec("ALTER TABLE track_licenses ADD COLUMN contractFeatures TEXT;");
  }
} catch (e) { console.error(e); }

// Migration: Add coverArtUrl if missing (aliasing thumbnail_url or new col)
try {
  const tableInfo = db.prepare("PRAGMA table_info(tracks)").all() as any[];
  const hasCover = tableInfo.some(col => col.name === 'coverArtUrl');
  if (!hasCover) {
    console.log('Migrating tracks: Adding coverArtUrl...');
    db.exec("ALTER TABLE tracks ADD COLUMN coverArtUrl TEXT;");
  }

  const hasGenre = tableInfo.some(col => col.name === 'genre');
  if (!hasGenre) {
    console.log('Migrating tracks: Adding genre...');
    db.exec("ALTER TABLE tracks ADD COLUMN genre TEXT DEFAULT 'Trap';");
  }
} catch (e) { console.error(e); }

// Indexes for new tables
db.exec(`
    CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(userId);
    CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(userId);
    CREATE INDEX IF NOT EXISTS idx_track_licenses_track ON track_licenses(trackId);
`);

// COUPONS TABLE
db.exec(`
    CREATE TABLE IF NOT EXISTS coupons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        discountPercent INTEGER NOT NULL,
        isActive INTEGER DEFAULT 1,
        expiresAt DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

// Migration: Add coupon fields to payments if missing
try {
  const tableInfo = db.prepare("PRAGMA table_info(payments)").all() as any[];
  const hasCouponCode = tableInfo.some(col => col.name === 'couponCode');

  if (!hasCouponCode) {
    console.log('Migrating payments table: Adding coupon columns...');
    db.exec("ALTER TABLE payments ADD COLUMN couponCode TEXT;");
    db.exec("ALTER TABLE payments ADD COLUMN discountAmount INTEGER;");
  }
} catch (error) {
  console.error('Error migrating payments schema:', error);
}

// CONTACT MESSAGES TABLE
db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        phonenumber TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

// Migration: Update licenses table (admin editable)
try {
  const tableInfo = db.prepare("PRAGMA table_info(licenses)").all() as any[];
  const hasSubtitle = tableInfo.some(col => col.name === 'subtitle');

  if (!hasSubtitle) {
    console.log('Migrating licenses table: Adding new columns...');
    db.exec("ALTER TABLE licenses ADD COLUMN subtitle TEXT;");
    db.exec("ALTER TABLE licenses ADD COLUMN priceType TEXT DEFAULT 'fixed';"); // fixed, starting, hidden
    db.exec("ALTER TABLE licenses ADD COLUMN isPopular INTEGER DEFAULT 0;");
    db.exec("ALTER TABLE licenses ADD COLUMN isActive INTEGER DEFAULT 1;");
    db.exec("ALTER TABLE licenses ADD COLUMN ctaText TEXT DEFAULT 'Buy Now';");
    db.exec("ALTER TABLE licenses ADD COLUMN sortOrder INTEGER DEFAULT 0;");
  }

  const hasDetails = tableInfo.some(col => col.name === 'details');
  if (!hasDetails) {
    console.log('Migrating licenses table: Adding details column...');
    db.exec("ALTER TABLE licenses ADD COLUMN details TEXT;");
  }
} catch (error) {
  console.error('Error migrating licenses schema:', error);
}

export default db
