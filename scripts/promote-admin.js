const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'app.db');
const db = new Database(dbPath);

const email = process.argv[2];

if (!email) {
    console.error("Please provide an email address.");
    console.log("Usage: node scripts/promote-admin.js <email>");
    process.exit(1);
}

try {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

    if (!user) {
        console.error(`User with email '${email}' not found.`);
        process.exit(1);
    }

    db.prepare("UPDATE users SET role = 'ADMIN' WHERE email = ?").run(email);
    console.log(`Success! User '${email}' is now an ALL-POWERFUL ADMIN.`);

} catch (error) {
    console.error("Error updating user role:", error);
}
