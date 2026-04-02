import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sendWatchlistAlert } from "@/lib/email";

const SIGNUPS_FILE = path.join(process.cwd(), "data", "watchlist-signups.jsonl");

interface WatchlistSignup {
  email: string;
  brands: string; // comma-separated slugs
  signedUpAt: string;
}

function readSignups(): WatchlistSignup[] {
  if (!fs.existsSync(SIGNUPS_FILE)) return [];
  const raw = fs.readFileSync(SIGNUPS_FILE, "utf8").trim();
  if (!raw) return [];
  return raw
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line) as WatchlistSignup;
      } catch {
        return null;
      }
    })
    .filter((entry): entry is WatchlistSignup => entry !== null);
}

export async function POST(req: NextRequest) {
  // Auth check
  const authHeader = req.headers.get("authorization") || "";
  const expectedSecret = process.env.ALERT_SECRET;
  if (!expectedSecret) {
    console.warn("[send-watchlist-alert] ALERT_SECRET is not set");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }
  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    brandSlug?: unknown;
    brandName?: unknown;
    changes?: unknown;
    recipientEmails?: unknown;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { brandSlug, brandName, changes, recipientEmails } = body;

  if (
    typeof brandSlug !== "string" ||
    typeof brandName !== "string" ||
    !Array.isArray(changes) ||
    changes.length === 0
  ) {
    return NextResponse.json(
      { error: "Missing required fields: brandSlug, brandName, changes" },
      { status: 400 }
    );
  }

  // Find all users watching this brand
  const signups = readSignups();
  const watcherEmails = new Set<string>();

  for (const signup of signups) {
    const slugs = signup.brands
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (slugs.includes(brandSlug.toLowerCase())) {
      watcherEmails.add(signup.email);
    }
  }

  // Merge with any explicitly passed recipient emails
  if (Array.isArray(recipientEmails)) {
    for (const email of recipientEmails) {
      if (typeof email === "string" && email.includes("@")) {
        watcherEmails.add(email.trim().toLowerCase());
      }
    }
  }

  let sent = 0;
  let errors = 0;

  const changeStrings = (changes as unknown[])
    .filter((c) => typeof c === "string")
    .map((c) => c as string);

  for (const email of watcherEmails) {
    const result = await sendWatchlistAlert({
      to: email,
      brandName: brandName as string,
      slug: brandSlug as string,
      changes: changeStrings,
    });

    if (result.success) {
      sent++;
    } else {
      errors++;
      console.error(`[send-watchlist-alert] Failed to send to ${email}:`, result.error);
    }
  }

  return NextResponse.json({ sent, errors });
}
