const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'app.db');
const db = new Database(dbPath);

console.log('Connected to database at', dbPath);

// Update satyam to ADMIN
const info = db.prepare("UPDATE users SET role = 'ADMIN' WHERE first_name LIKE '%satyam%' OR email LIKE '%satyam%'").run();

console.log(`Updated ${info.changes} users to ADMIN role.`);

// Verify
const users = db.prepare("SELECT id, email, first_name, role FROM users WHERE role = 'ADMIN'").all();
console.log('Admins:', users);
