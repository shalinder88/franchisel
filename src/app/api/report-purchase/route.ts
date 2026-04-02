import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sendReportPurchaseConfirmation } from "@/lib/email";

const PURCHASES_FILE = path.join(process.cwd(), "data", "report-purchases.jsonl");

type ReportTier = "standard" | "premium" | "executive";

const VALID_TIERS: ReportTier[] = ["standard", "premium", "executive"];

interface PurchaseRecord {
  email: string;
  brandSlug: string;
  brandName: string;
  tier: ReportTier;
  purchasedAt: string;
}

export async function POST(req: NextRequest) {
  let body: {
    email?: unknown;
    brandSlug?: unknown;
    brandName?: unknown;
    tier?: unknown;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, brandSlug, brandName, tier } = body;

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (typeof brandSlug !== "string" || !brandSlug) {
    return NextResponse.json({ error: "Invalid brandSlug" }, { status: 400 });
  }
  if (typeof brandName !== "string" || !brandName) {
    return NextResponse.json({ error: "Invalid brandName" }, { status: 400 });
  }
  if (typeof tier !== "string" || !VALID_TIERS.includes(tier as ReportTier)) {
    return NextResponse.json(
      { error: "Invalid tier — must be standard, premium, or executive" },
      { status: 400 }
    );
  }

  const record: PurchaseRecord = {
    email: email.trim().toLowerCase(),
    brandSlug: brandSlug.trim(),
    brandName: brandName.trim(),
    tier: tier as ReportTier,
    purchasedAt: new Date().toISOString(),
  };

  // Ensure data dir exists
  const dir = path.dirname(PURCHASES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Persist purchase record
  try {
    fs.appendFileSync(PURCHASES_FILE, JSON.stringify(record) + "\n", "utf8");
  } catch (err) {
    console.error("[report-purchase] Failed to write purchase record:", err);
    return NextResponse.json({ error: "Failed to save purchase" }, { status: 500 });
  }

  // Send confirmation email (non-fatal if it fails)
  const emailResult = await sendReportPurchaseConfirmation({
    to: record.email,
    brandName: record.brandName,
    slug: record.brandSlug,
    tier: record.tier,
  });

  if (!emailResult.success) {
    console.error("[report-purchase] Confirmation email failed:", emailResult.error);
  }

  return NextResponse.json({ success: true });
}
