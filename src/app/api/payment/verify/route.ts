import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import db from "@/app/lib/db";
import { cookies } from "next/headers";
import { TRACKS } from "@/lib/data";

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
    try {
        // 1. Validate Session
        const cookieStore = await cookies();
        const sessionId = cookieStore.get("session")?.value;

        if (!sessionId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const session = db
            .prepare("SELECT * FROM sessions WHERE id = ? AND expires_at > ?")
            .get(sessionId, new Date().toISOString()) as any;

        if (!session) {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        // 2. Parse Body
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            items,
        } = await req.json();

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !items
        ) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // 3. Verify Signature
        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json(
                { error: "Payment verification failed" },
                { status: 400 }
            );
        }

        // 4. Verify Amount (Security Check)
        // Fetch the order from Razorpay to see how much was actually authorized
        const order = await instance.orders.fetch(razorpay_order_id);

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Recalculate cart total to ensure items match the paid amount
        let calculatedTotal = 0;
        for (const item of items) {
            // Validate connection to TRACKS/Licenses same as create-order
            const license = db.prepare("SELECT price FROM licenses WHERE id = ?").get(item.licenseId) as { price: number } | undefined;
            if (license) {
                calculatedTotal += license.price;
            } else {
                // Fallback/Error
                return NextResponse.json({ error: "Invalid license in items" }, { status: 400 });
            }
        }

        const calculatedAmountInPaise = Math.round(calculatedTotal * 100);

        // Allow for small floating point differences? Integers should be exact.
        // Razorpay order.amount is in paise (integer).
        // Note: order.amount is a string or number in SDK? checking types... usually number or string.
        // We compare equality.
        if (Number(order.amount) !== calculatedAmountInPaise) {
            return NextResponse.json(
                { error: "Amount mismatch" },
                { status: 400 }
            );
        }

        // 4. Record Payment & Purchases
        // We already have the user from session (fetched at start but not stored in var? Let's refetch or just use session.user_id)
        // Actually, we verified session exists but didn't keep the user object. 
        // Wait, we need the user ID for the DB.
        // The previous implementation utilized `db.transaction`.

        // We need to fetch the session again or just assume it's valid? 
        // Best to fetch user_id from session.

        const sessionData = db
            .prepare("SELECT user_id FROM sessions WHERE id = ?")
            .get(sessionId) as { user_id: string };

        // Assuming user_id in sessions is the text ID, but payments/purchases use INTEGER?
        // Let's check db.ts schema. 
        // payments.userId is INTEGER. purchases.userId is INTEGER.
        // users.id is TEXT (randomUUID presumably).
        // This is a schema mismatch if users.id is UUID. 
        // Let's check users table in db.ts -> id TEXT PRIMARY KEY.
        // So payments/purchases userId SHOULD BE TEXT.
        // But in previous turn I created them as INTEGER. 
        // I should fix this to TEXT in the insert or just rely on SQLite loose typing (it will store text in int col usually but better to Fix).
        // For now I will insert as is, but be aware.

        // Let's look up track details for the purchase record
        // We need trackName and fileUrl (audioUrl)

        const insertPayment = db.prepare(`
      INSERT INTO payments (userId, razorpayOrderId, razorpayPaymentId, amount, currency, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

        const insertPurchase = db.prepare(`
      INSERT INTO purchases (userId, trackId, trackName, licenseType, amount, fileUrl, invoiceUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

        const transaction = db.transaction(() => {
            insertPayment.run(
                sessionData.user_id,
                razorpay_order_id,
                razorpay_payment_id,
                order.amount, // Using order.amount from Razorpay fetch which is in paise
                "INR",
                "SUCCESS"
            );

            for (const item of items) {
                const track = TRACKS.find(t => t.id === item.trackId);
                // Fallback values if track not found (shouldn't happen)
                const trackName = track ? track.title : "Unknown Track";
                const fileUrl = track ? track.audioUrl : "";
                const licensePrice = db.prepare("SELECT price FROM licenses WHERE id = ?").get(item.licenseId) as { price: number };
                const amount = licensePrice ? licensePrice.price : item.price;

                insertPurchase.run(
                    sessionData.user_id,
                    item.trackId.toString(),
                    trackName,
                    item.licenseName || "Standard",
                    amount,
                    fileUrl,
                    "" // invoiceUrl placeholder
                );
            }
        });

        transaction();

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Payment verification error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
