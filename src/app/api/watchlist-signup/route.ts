import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sendWatchlistSignupConfirmation } from "@/lib/email";

const SIGNUPS_FILE = path.join(process.cwd(), "data", "watchlist-signups.jsonl");

export async function POST(req: NextRequest) {
  try {
    const { email, brands } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const entry = {
      email: email.trim().toLowerCase(),
      brands: brands ? String(brands).trim() : "",
      signedUpAt: new Date().toISOString(),
    };

    // Ensure data dir exists
    const dir = path.dirname(SIGNUPS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Append as newline-delimited JSON
    fs.appendFileSync(SIGNUPS_FILE, JSON.stringify(entry) + "\n", "utf8");

    // Send confirmation email (non-fatal if it fails)
    const brandNames = entry.brands
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (brandNames.length > 0) {
      const emailResult = await sendWatchlistSignupConfirmation({
        to: entry.email,
        brandNames,
      });
      if (!emailResult.success) {
        console.warn("[watchlist-signup] Confirmation email failed:", emailResult.error);
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
