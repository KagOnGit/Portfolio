import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { name, email, message, honeypot } = await req.json();

    // Honeypot spam protection
    if (honeypot) {
      return NextResponse.json({ ok: false, error: "Spam detected" }, { status: 400 });
    }

    // Send email via Resend if API key is configured
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>", // Use verified domain in production
        to: "adityasingh0929@gmail.com",
        subject: `New portfolio message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>New Portfolio Contact</h2>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        `,
      });
    } else {
      // Fallback: log to console if no API key
      console.log("Contact submission:", { name, email, message });
    }

    return NextResponse.json({ ok: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send message. Please try again." }, 
      { status: 500 }
    );
  }
}
