import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { randomBytes } from "crypto";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;

    // If user not found or already verified, return success to prevent enumeration
    if (!user || user.isVerified) {
        return NextResponse.json({ success: true, message: "If account exists and is unverified, email sent." });
    }

    // Generate new token
    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    try {
        db.prepare(`
            UPDATE users 
            SET verificationToken = ?, verificationTokenExpires = ? 
            WHERE id = ?
        `).run(verificationToken, verificationTokenExpires, user.id);

        // Send verification email
        const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${verificationToken}`;

        await resend.emails.send({
            from: 'Doz Dripz <noreply@contact.ksatyam.online>',
            to: email,
            subject: 'Verify your email for Doz Dripz (Resend)',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Verify your email</title>
                </head>

                <body style="
                margin: 0;
                padding: 0;
                background-color: #0f0f0f;
                font-family: Arial, Helvetica, sans-serif;
                color: #ffffff;
                ">

                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                    <td align="center" style="padding: 24px;">
                        
                        <!-- Container -->
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                        style="max-width:600px; background-color:#1a1a1a; border-radius:12px; overflow:hidden;">

                        <!-- Header -->
                        <tr>
                            <td align="center" style="padding:40px 24px 20px;">
                            <h2 style="
                                margin:0;
                                font-size:22px;
                                letter-spacing:2px;
                                font-weight:700;
                                text-transform:uppercase;
                                color:#f20d0d;
                            ">
                                DOZ DRIPZ
                            </h2>
                            </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                            <td align="center" style="padding: 0 32px 32px;">
                            <h1 style="
                                margin:0 0 16px;
                                font-size:28px;
                                line-height:1.3;
                                font-weight:700;
                                color:#ffffff;
                            ">
                                Verify your email
                            </h1>

                            <p style="
                                margin:0 0 32px;
                                font-size:16px;
                                line-height:1.6;
                                color:#a1a1aa;
                                max-width:420px;
                            ">
                                Click the button below to securely sign in to your account.
                            </p>

                            <!-- Button -->
                            <a href="${verificationUrl}" style="
                                display:inline-block;
                                background-color:#f20d0d;
                                color:#ffffff;
                                text-decoration:none;
                                padding:16px 28px;
                                font-size:16px;
                                font-weight:700;
                                border-radius:8px;
                            ">
                                Sign in to DOZ DRIPZ
                            </a>

                            <!-- Fallback link -->
                            <p style="
                                margin:40px 0 8px;
                                font-size:12px;
                                letter-spacing:1px;
                                text-transform:uppercase;
                                color:#71717a;
                            ">
                                Trouble clicking? Copy and paste this link:
                            </p>

                            <div style="
                                background-color:#0f0f0f;
                                border:1px solid #27272a;
                                border-radius:8px;
                                padding:12px;
                                word-break:break-all;
                            ">
                                <a href="${verificationUrl}" style="
                                font-size:13px;
                                color:#f20d0d;
                                text-decoration:underline;
                                ">
                                ${verificationUrl}
                                </a>
                            </div>

                            <p style="
                                margin-top:24px;
                                font-size:12px;
                                color:#71717a;
                            ">
                                This secure link expires in
                                <strong style="color:#f20d0d;">15 minutes</strong>
                                and can only be used once.
                            </p>
                            </td>
                        </tr>

                        </table>

                        <!-- Footer -->
                        <p style="
                        max-width:600px;
                        margin:24px auto 0;
                        font-size:11px;
                        line-height:1.6;
                        color:#52525b;
                        text-align:center;
                        ">
                        DOZ DRIPZ Studio<br/>
                        123 Creative Avenue, Design District, NY 10001<br/><br/>
                        If you didn’t request this email, you can safely ignore it.
                        </p>

                        <p style="
                        margin-top:16px;
                        font-size:10px;
                        letter-spacing:2px;
                        text-transform:uppercase;
                        color:#3f3f46;
                        text-align:center;
                        ">
                        © 2024 DOZ DRIPZ Inc.
                        </p>

                    </td>
                    </tr>
                </table>

                </body>
                </html>
            `
        });

        return NextResponse.json({ success: true, message: "If account exists and is unverified, email sent." });
    } catch (error) {
        console.error("Resend verification error:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}
