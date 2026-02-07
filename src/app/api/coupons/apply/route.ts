
import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function POST(req: Request) {
    try {
        const { code, cartTotal } = await req.json();

        if (!code || !cartTotal) {
            return NextResponse.json({ error: 'Missing code or cartTotal' }, { status: 400 });
        }

        const coupon = db.prepare('SELECT * FROM coupons WHERE code = ?').get(code.toUpperCase()) as any;

        if (!coupon) {
            return NextResponse.json({ valid: false, error: 'Invalid coupon code' }, { status: 400 });
        }

        if (!coupon.isActive) {
            return NextResponse.json({ valid: false, error: 'Coupon is inactive' }, { status: 400 });
        }

        if (new Date(coupon.expiresAt) < new Date()) {
            return NextResponse.json({ valid: false, error: 'Coupon has expired' }, { status: 400 });
        }

        // Calculate discount
        const discountAmount = Math.floor(cartTotal * (coupon.discountPercent / 100));
        const finalAmount = Math.max(0, cartTotal - discountAmount); // Ensure no negative total

        return NextResponse.json({
            valid: true,
            code: coupon.code,
            discountPercent: coupon.discountPercent,
            discountAmount,
            finalAmount
        });

    } catch (error) {
        console.error('Coupon apply error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
