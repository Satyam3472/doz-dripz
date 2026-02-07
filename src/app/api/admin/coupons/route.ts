
import { NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { cookies } from 'next/headers';

// Helper to check admin auth
async function checkAdmin() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;
    if (!sessionId) return false;

    const session = db.prepare(`
        SELECT users.role 
        FROM sessions 
        JOIN users ON sessions.user_id = users.id 
        WHERE sessions.id = ? AND sessions.expires_at > ?
    `).get(sessionId, new Date().toISOString()) as { role: string } | undefined;

    return session?.role === 'ADMIN';
}

export async function GET() {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const coupons = db.prepare('SELECT * FROM coupons ORDER BY createdAt DESC').all();
        return NextResponse.json(coupons);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { code, discountPercent, expiresAt } = await req.json();

        if (!code || !discountPercent) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const stmt = db.prepare(`
            INSERT INTO coupons (code, discountPercent, expiresAt, isActive)
            VALUES (?, ?, ?, 1)
        `);

        stmt.run(code.toUpperCase(), discountPercent, expiresAt);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
    }
}
