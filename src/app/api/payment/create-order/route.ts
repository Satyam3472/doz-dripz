import { NextResponse } from "next/server";
import Razorpay from "razorpay";
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

        // Fetch user details for prefill
        const user = db.prepare("SELECT first_name, last_name, email, phone FROM users WHERE id = ?").get(session.user_id) as any;

        // 2. Parse Body & Calculate Price
        const { items } = await req.json();

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        let totalAmount = 0;

        for (const item of items) {
            const track = TRACKS.find((t) => t.id === item.trackId);
            if (!track) {
                return NextResponse.json(
                    { error: `Track not found: ${item.trackId}` },
                    { status: 400 }
                );
            }

            const license = db.prepare("SELECT price FROM licenses WHERE id = ?").get(item.licenseId) as { price: number } | undefined;

            if (license) {
                totalAmount += license.price;
            } else {
                return NextResponse.json({ error: "Invalid license" }, { status: 400 });
            }
        }

        // Razorpay expects amount in paise
        const amountInPaise = Math.round(totalAmount * 100);

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await instance.orders.create(options);

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            user: {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                contact: user.phone
            }
        });

    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
