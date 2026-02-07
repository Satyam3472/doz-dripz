
import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { headers } from "next/headers";

export const runtime = "nodejs";

// GET: Fetch all licenses ordered by sortOrder
export async function GET() {
    try {
        // Auth Check (Basic role check can be added here or via middleware)
        // const headersList = headers();
        // const role = headersList.get("x-user-role"); 
        // if (role !== 'ADMIN' && role !== 'MUSICIAN') ... (Middleware handles this usually)

        const licenses = db.prepare("SELECT * FROM licenses ORDER BY sortOrder ASC").all();

        // One-time fix: Ensure Exclusive uses "Make an Offer" priceType and Unlimited is Popular
        // This acts as a migration for existing data
        const hasExclusive = licenses.find((l: any) => l.name === 'Exclusive');
        const hasUnlimited = licenses.find((l: any) => l.name === 'Unlimited');

        if (hasExclusive && hasExclusive.priceType !== 'hidden') {
            db.prepare("UPDATE licenses SET priceType = 'hidden', ctaText = 'Make an Offer' WHERE name = 'Exclusive'").run();
        }
        // Seed details if missing (for the modal)
        if (hasExclusive && !hasExclusive.details) {
            db.prepare("UPDATE licenses SET details = 'This license grants you full ownership rights...' WHERE name = 'Exclusive'").run();
        }
        if (hasUnlimited && !hasUnlimited.isPopular) {
            db.prepare("UPDATE licenses SET isPopular = 1 WHERE name = 'Unlimited'").run();
            // Ensure others are not popular if single popular logic is desired, though multiple allowed
            db.prepare("UPDATE licenses SET isPopular = 0 WHERE name != 'Unlimited'").run();
        }

        // Re-fetch to get updated values
        const updatedLicenses = db.prepare("SELECT * FROM licenses ORDER BY sortOrder ASC").all();

        // Parse features and bulk_deals from JSON
        const parsedLicenses = updatedLicenses.map((l: any) => ({
            ...l,
            features: l.features ? JSON.parse(l.features) : [],
            // bulk_deals might need parsing if it stored as JSON string, but schema comment says TEXT. 
            // If it's simple text, no parse needed. User req says "Edit bulk deal text", suggesting simple string.
            // But previous schema comment said "-- JSON array". I'll assume it's storing simple text now based on "subtitle/short desc" reqs, 
            // but let's stick to existing if unsure. 
            // Let's assume it's just a string for the deal text (e.g. "Buy 2 Get 1 Free").
            // Accessing it as is.
            isPopular: Boolean(l.isPopular),
            isActive: Boolean(l.isActive)
        }));

        // If no licenses exist, seed defaults
        if (parsedLicenses.length === 0) {
            const defaults = [
                {
                    name: "Standard",
                    subtitle: "Best for emerging artists",
                    price: 29.99,
                    priceType: "fixed",
                    features: JSON.stringify(["MP3 Delivery", "10,000 Streams Limit", "Non-Profit Use Only"]),
                    bulk_deals: "BUY 2 TRACKS, GET 1 FREE!",
                    type: "MP3",
                    isPopular: 0,
                    isActive: 1,
                    ctaText: "Read License",
                    sortOrder: 1
                },
                {
                    name: "Unlimited",
                    subtitle: "Ideal for growing channels",
                    price: 99.99,
                    priceType: "fixed",
                    features: JSON.stringify(["MP3 + WAV Delivery", "Unlimited Streams", "Music Video Rights"]),
                    bulk_deals: "BUY 3 TRACKS, GET 2 FREE!",
                    type: "UNLIMITED",
                    isPopular: 1,
                    isActive: 1,
                    ctaText: "Read License",
                    sortOrder: 2
                },
                {
                    name: "Exclusive",
                    subtitle: "Full ownership transfer",
                    price: 999.00,
                    priceType: "starting",
                    features: JSON.stringify(["Full Ownership", "Unlimited Distribution", "Track Removed"]),
                    bulk_deals: "",
                    type: "EXCLUSIVE",
                    isPopular: 0,
                    isActive: 1,
                    ctaText: "Make an Offer",
                    sortOrder: 3
                }
            ];

            const insert = db.prepare(`
                INSERT INTO licenses (name, subtitle, price, priceType, features, bulk_deals, type, isPopular, isActive, ctaText, sortOrder)
                VALUES (@name, @subtitle, @price, @priceType, @features, @bulk_deals, @type, @isPopular, @isActive, @ctaText, @sortOrder)
            `);

            const insertMany = db.transaction((items) => {
                for (const item of items) insert.run(item);
            });

            insertMany(defaults);

            // Return seeded
            return NextResponse.json(defaults.map(d => ({
                ...d,
                features: JSON.parse(d.features),
                isPopular: Boolean(d.isPopular),
                isActive: Boolean(d.isActive)
            })));
        }

        return NextResponse.json(parsedLicenses);
    } catch (error) {
        console.error("Error fetching licenses:", error);
        return NextResponse.json({ error: "Failed to fetch licenses" }, { status: 500 });
    }
}

// PUT: Update multiple licenses
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { licenses } = body; // Expecting { licenses: [...] }

        if (!Array.isArray(licenses)) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
        }

        const update = db.prepare(`
            UPDATE licenses 
            SET 
                name = @name,
                subtitle = @subtitle,
                price = @price,
                priceType = @priceType,
                features = @features,
                bulk_deals = @bulk_deals,
                isPopular = @isPopular,
                isActive = @isActive,
                isActive = @isActive,
                ctaText = @ctaText,
                details = @details
            WHERE id = @id
        `);

        const updateMany = db.transaction((items) => {
            for (const item of items) {
                update.run({
                    ...item,
                    features: JSON.stringify(item.features), // Ensure array -> string
                    isPopular: item.isPopular ? 1 : 0,
                    isActive: item.isActive ? 1 : 0
                });
            }
        });

        updateMany(licenses);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error updating licenses:", error);
        return NextResponse.json({ error: "Failed to update licenses" }, { status: 500 });
    }
}
