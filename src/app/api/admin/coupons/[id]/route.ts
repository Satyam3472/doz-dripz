
import { NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { cookies } from 'next/headers';

async function checkAdmin() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;
    if (!sessionId) return false;
    const session = db.prepare(`SELECT users.role FROM sessions JOIN users ON sessions.user_id = users.id WHERE sessions.id = ? AND sessions.expires_at > ?`).get(sessionId, new Date().toISOString()) as { role: string } | undefined;
    return session?.role === 'ADMIN';
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const { code, discountPercent, isActive, expiresAt } = await req.json();

        db.prepare(`
            UPDATE coupons 
            SET code = ?, discountPercent = ?, isActive = ?, expiresAt = ?
            WHERE id = ?
        `).run(code.toUpperCase(), discountPercent, isActive ? 1 : 0, expiresAt, id);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        db.prepare('DELETE FROM coupons WHERE id = ?').run(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
    }
}
