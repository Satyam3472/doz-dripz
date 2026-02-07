const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'app.db');
const db = new Database(dbPath);

console.log('Connected to database at', dbPath);

// List all users
const users = db.prepare("SELECT id, email, first_name, role FROM users").all();
console.log('Current Users:', users);

// Find potential admin (assuming email contains 'admin' or just picking the first one if unsure, but better to let user identify)
// I will just print them first.
