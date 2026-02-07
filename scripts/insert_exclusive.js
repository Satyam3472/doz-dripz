const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'app.db');
const db = new Database(dbPath);

console.log('Connected to database at', dbPath);

// Check if Exclusive license exists
const existing = db.prepare("SELECT * FROM licenses WHERE name = 'Exclusive'").get();

if (existing) {
    console.log('Exclusive license exists. Updating...');
    db.prepare(`
        UPDATE licenses 
        SET 
            price = 1000.00,
            priceType = 'hidden',
            details = 'Full ownership transfer. Unlimited distribution. Track removed from store.',
            ctaText = 'READ LICENSE',
            isActive = 1,
            sortOrder = 3
        WHERE name = 'Exclusive'
    `).run();
    console.log('Updated existing Exclusive license.');
} else {
    console.log('Inserting new Exclusive license...');
    db.prepare(`
        INSERT INTO licenses (name, subtitle, price, priceType, features, bulk_deals, type, isPopular, isActive, ctaText, sortOrder, details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        'Exclusive',
        'Full ownership transfer',
        1000.00,
        'hidden',
        JSON.stringify(["Full Ownership", "Unlimited Distribution", "Track Removed"]),
        '',
        'EXCLUSIVE',
        0,
        1,
        'READ LICENSE',
        3,
        'Full ownership transfer. Unlimited distribution. Track removed from store.'
    );
    console.log('Inserted new Exclusive license.');
}

// Verify
const exclusive = db.prepare("SELECT * FROM licenses WHERE name = 'Exclusive'").get();
console.log('Exclusive license record:', exclusive);
