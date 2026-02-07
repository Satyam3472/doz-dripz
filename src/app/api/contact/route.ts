
import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, message, phonenumber } = body;

        // 1. Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (message.length < 10) {
            return NextResponse.json(
                { error: "Message must be at least 10 characters long" },
                { status: 400 }
            );
        }

        // Basic Email Validation Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        // 2. Database Insertion
        try {
            const stmt = db.prepare(`
                INSERT INTO contact_messages (name, email, message, phonenumber)
                VALUES (?, ?, ?, ?)
            `);
            stmt.run(name, email, message, phonenumber || null);
        } catch (dbError) {
            console.error("Database Error:", dbError);
            return NextResponse.json(
                { error: "Failed to save message" },
                { status: 500 }
            );
        }

        // 3. Send Email via Resend
        try {

            const { data, error } = await resend.emails.send({
                from: 'Doz Dripz <noreply@contact.ksatyam.online>',
                to: 'kumarsatyam8298380149@gmail.com',
                subject: `New Contact Message: ${name}`,
                html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
            </head>
            <body style="
                margin:0;
                padding:0;
                background-color:#0f0f0f;
                font-family: Arial, Helvetica, sans-serif;
                color:#ffffff;
            ">

                <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center" style="padding:24px;">

                    <table width="100%" cellpadding="0" cellspacing="0"
                        style="
                        max-width:600px;
                        background-color:#1a1a1a;
                        border-radius:12px;
                        border:1px solid #27272a;
                        overflow:hidden;
                        ">

                        <tr>
                        <td style="padding:24px 32px; text-align:center;">
                            <h2 style="
                            margin:0;
                            font-size:20px;
                            letter-spacing:2px;
                            text-transform:uppercase;
                            color:#f20d0d;
                            ">
                            DOZ DRIPZ
                            </h2>
                            <p style="
                            margin:8px 0 0;
                            font-size:12px;
                            color:#71717a;
                            ">
                            New Contact Message
                            </p>
                        </td>
                        </tr>

                        <tr>
                        <td style="border-top:1px solid #27272a;"></td>
                        </tr>
                        <tr>
                        <td style="padding:32px;">

                            <h1 style="
                            margin:0 0 24px;
                            font-size:22px;
                            color:#ffffff;
                            ">
                            ${name} contacted you
                            </h1>

                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                            <tr>
                                <td style="padding:6px 0; font-size:14px; color:#a1a1aa;">
                                <strong style="color:#ffffff;">Email:</strong> ${email}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:6px 0; font-size:14px; color:#a1a1aa;">
                                <strong style="color:#ffffff;">Phone:</strong> ${phonenumber || "N/A"}
                                </td>
                            </tr>
                            </table>

                            <div style="
                            background-color:#0f0f0f;
                            border:1px solid #27272a;
                            border-radius:8px;
                            padding:16px;
                            ">
                            <p style="
                                margin:0 0 8px;
                                font-size:13px;
                                text-transform:uppercase;
                                letter-spacing:1px;
                                color:#71717a;
                            ">
                                Message
                            </p>

                            <p style="
                                margin:0;
                                font-size:15px;
                                line-height:1.6;
                                color:#e4e4e7;
                                white-space:pre-wrap;
                            ">
            ${message}
                            </p>
                            </div>

                        </td>
                        </tr>

                        <tr>
                        <td style="
                            padding:20px 32px;
                            border-top:1px solid #27272a;
                            font-size:12px;
                            color:#71717a;
                            text-align:center;
                        ">
                            Received on ${new Date().toLocaleString()}
                        </td>
                        </tr>

                    </table>

                    <p style="
                        margin-top:16px;
                        font-size:10px;
                        letter-spacing:2px;
                        text-transform:uppercase;
                        color:#3f3f46;
                        text-align:center;
                    ">
                        © ${new Date().getFullYear()} DOZ DRIPZ
                    </p>

                    </td>
                </tr>
                </table>

            </body>
            </html>
            `
            });

            if (error) {
                console.error("Resend Error:", error);
                // Don't fail the request if email fails, but log it. 
                // DB save is the source of truth.
            }
        } catch (emailError) {
            console.error("Email Sending Error:", emailError);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Contact API Critical Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
