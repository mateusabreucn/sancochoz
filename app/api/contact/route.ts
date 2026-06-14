import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

// Server-side limits mirror the form's maxLength attributes — the client
// caps are advisory only and can be bypassed with a direct POST
const schema = z.object({
  name: z.string().trim().min(1).max(80),
  phone: z.string().trim().max(30).optional(),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(1).max(2000),
});

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  // Opportunistic prune so the map never grows unbounded
  if (hits.size > 500) {
    hits.forEach((times, key) => {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    });
  }
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const data = schema.parse(await request.json());

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Sancochoz Site <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || "gustavo@sancochoz.com",
      reply_to: data.email,
      subject: `New contact from ${data.name}`,
      html: `
        <h2>New message from sancochoz.com</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(data.phone || "Not provided")}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
