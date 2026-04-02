import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SUBMISSIONS_FILE = path.join(process.cwd(), "data", "community-submissions.jsonl");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brandSlug, brandName, investment, revenue, satisfaction, wouldDoAgain } = body;

    if (!brandSlug || typeof brandSlug !== "string") {
      return NextResponse.json({ error: "brandSlug required" }, { status: 400 });
    }
    if (satisfaction !== undefined && (typeof satisfaction !== "number" || satisfaction < 1 || satisfaction > 10)) {
      return NextResponse.json({ error: "satisfaction must be 1–10" }, { status: 400 });
    }

    const entry = {
      brandSlug: brandSlug.trim(),
      brandName: brandName ? String(brandName).trim() : "",
      investment: investment ? String(investment).trim() : "",
      revenue: revenue ? String(revenue).trim() : "",
      satisfaction: satisfaction ?? null,
      wouldDoAgain: wouldDoAgain ?? null,
      submittedAt: new Date().toISOString(),
    };

    const dir = path.dirname(SUBMISSIONS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.appendFileSync(SUBMISSIONS_FILE, JSON.stringify(entry) + "\n", "utf8");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
