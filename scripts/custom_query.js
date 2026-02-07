const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'app.db');
const db = new Database(dbPath);

console.log('Connected to database at', dbPath);

// List all users
const users = db.prepare("SELECT * FROM tracks").all();
const query_result = db.prepare("Update tracks set price = '2499.99', duration = '211' where id in ('4', '5')").run();
console.log('Current Users:', query_result);

;

// Find potential admin (assuming email contains 'admin' or just picking the first one if unsure, but better to let user identify)
// I will just print them first.
