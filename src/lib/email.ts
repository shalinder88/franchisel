import { Resend } from "resend";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "reports@franchisel.com";

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY is not set — email sending disabled");
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export interface EmailResult {
  success: boolean;
  error?: string;
}

// ─── Watchlist Alert ──────────────────────────────────────────────────────────

export async function sendWatchlistAlert(params: {
  to: string;
  brandName: string;
  slug: string;
  changes: string[];
}): Promise<EmailResult> {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: "Email service not configured" };
  }

  const { to, brandName, slug, changes } = params;
  const diffUrl = `https://franchisel.com/brands/${slug}/diff`;
  const brandUrl = `https://franchisel.com/brands/${slug}`;

  const changesHtml = changes
    .map((c) => `<li style="margin-bottom:6px;">${escapeHtml(c)}</li>`)
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f8f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
        <tr>
          <td style="background:#1a1a2e;padding:24px 32px;">
            <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-.5px;">Franchisel</span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <h2 style="margin:0 0 8px;font-size:20px;color:#111;">FDD data updated for <strong>${escapeHtml(brandName)}</strong></h2>
            <p style="margin:0 0 24px;color:#555;font-size:15px;">We detected changes in the latest FDD filing. Here's what changed:</p>

            <ul style="margin:0 0 24px;padding-left:20px;color:#333;font-size:15px;line-height:1.6;">
              ${changesHtml}
            </ul>

            <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="padding-right:12px;">
                  <a href="${diffUrl}" style="display:inline-block;background:#1a1a2e;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:600;">View Changes (Diff)</a>
                </td>
                <td>
                  <a href="${brandUrl}" style="display:inline-block;background:#f0f0f0;color:#333;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:600;">Full Brand Page</a>
                </td>
              </tr>
            </table>

            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
            <p style="margin:0;color:#999;font-size:12px;line-height:1.5;">
              You're receiving this because you added ${escapeHtml(brandName)} to your Franchisel watchlist.
              Unsubscribe by replying to this email.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `[Franchisel Alert] ${brandName} FDD data updated`,
      html,
    });

    if (error) {
      console.error("[email] sendWatchlistAlert error:", error);
      return { success: false, error: String(error) };
    }
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[email] sendWatchlistAlert threw:", msg);
    return { success: false, error: msg };
  }
}

// ─── Watchlist Signup Confirmation ───────────────────────────────────────────

export async function sendWatchlistSignupConfirmation(params: {
  to: string;
  brandNames: string[];
}): Promise<EmailResult> {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: "Email service not configured" };
  }

  const { to, brandNames } = params;
  const brandList =
    brandNames.length === 1
      ? escapeHtml(brandNames[0])
      : brandNames.slice(0, -1).map(escapeHtml).join(", ") +
        " and " +
        escapeHtml(brandNames[brandNames.length - 1]);

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f8f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
        <tr>
          <td style="background:#1a1a2e;padding:24px 32px;">
            <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-.5px;">Franchisel</span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <h2 style="margin:0 0 8px;font-size:20px;color:#111;">You're on the watchlist</h2>
            <p style="margin:0 0 24px;color:#555;font-size:15px;">
              You're now watching <strong>${brandList}</strong>.
              We'll email you when their FDD data changes.
            </p>
            <p style="margin:0 0 24px;color:#555;font-size:15px;">
              FDD filings are updated annually. When a new FDD is filed or we detect material changes
              to key items (outlet counts, fees, litigation, financials), you'll hear from us.
            </p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
            <p style="margin:0;color:#999;font-size:12px;line-height:1.5;">
              To stop receiving alerts, reply to this email with "unsubscribe".
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `You're watching ${brandNames.length === 1 ? brandNames[0] : `${brandNames.length} brands`} on Franchisel`,
      html,
    });

    if (error) {
      console.error("[email] sendWatchlistSignupConfirmation error:", error);
      return { success: false, error: String(error) };
    }
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[email] sendWatchlistSignupConfirmation threw:", msg);
    return { success: false, error: msg };
  }
}

// ─── Report Purchase Confirmation ─────────────────────────────────────────────

type ReportTier = "standard" | "premium" | "executive";

const TIER_DETAILS: Record<ReportTier, { label: string; includes: string[] }> = {
  standard: {
    label: "Standard Diligence Report",
    includes: [
      "FDD Item-by-Item summary (all 23 items)",
      "Outlet count trends and territory analysis",
      "Fees breakdown (initial, royalty, marketing)",
      "Key litigation and legal flag summary",
    ],
  },
  premium: {
    label: "Premium Diligence Report",
    includes: [
      "Everything in Standard",
      "Year-over-year FDD change analysis",
      "Financial performance representation (Item 19) deep-dive",
      "Franchisee validation call script",
      "Comparable brand benchmarks",
    ],
  },
  executive: {
    label: "Executive Diligence Report",
    includes: [
      "Everything in Premium",
      "Full buyer memo (investment thesis + risk factors)",
      "SBA loan eligibility assessment",
      "Territory mapping and market saturation analysis",
      "Priority analyst Q&A (48-hour turnaround)",
    ],
  },
};

export async function sendReportPurchaseConfirmation(params: {
  to: string;
  brandName: string;
  slug: string;
  tier: ReportTier;
  reportName?: string;
}): Promise<EmailResult> {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: "Email service not configured" };
  }

  const { to, brandName, slug, tier } = params;
  const tierInfo = TIER_DETAILS[tier];
  const reportName = params.reportName || tierInfo.label;
  const brandUrl = `https://franchisel.com/brands/${slug}`;
  const memoUrl = `https://franchisel.com/brands/${slug}/memo`;
  const diligenceUrl = `https://franchisel.com/brands/${slug}/diligence`;

  const includesHtml = tierInfo.includes
    .map((item) => `<li style="margin-bottom:6px;">${escapeHtml(item)}</li>`)
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f8f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
        <tr>
          <td style="background:#1a1a2e;padding:24px 32px;">
            <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-.5px;">Franchisel</span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <h2 style="margin:0 0 8px;font-size:20px;color:#111;">Thank you for your purchase</h2>
            <p style="margin:0 0 24px;color:#555;font-size:15px;">
              Your <strong>${escapeHtml(reportName)}</strong> for <strong>${escapeHtml(brandName)}</strong>
              is being prepared and will be delivered to this email address within 24 hours.
            </p>

            <div style="background:#f7f8fa;border-radius:6px;padding:20px 24px;margin-bottom:24px;">
              <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#333;text-transform:uppercase;letter-spacing:.5px;">What's included</p>
              <ul style="margin:0;padding-left:20px;color:#444;font-size:14px;line-height:1.7;">
                ${includesHtml}
              </ul>
            </div>

            <p style="margin:0 0 16px;color:#555;font-size:15px;">While you wait, explore the free preview pages for ${escapeHtml(brandName)}:</p>

            <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="padding-right:10px;">
                  <a href="${memoUrl}" style="display:inline-block;background:#f0f0f0;color:#333;text-decoration:none;padding:10px 18px;border-radius:6px;font-size:13px;font-weight:600;">Buyer Memo Preview</a>
                </td>
                <td style="padding-right:10px;">
                  <a href="${diligenceUrl}" style="display:inline-block;background:#f0f0f0;color:#333;text-decoration:none;padding:10px 18px;border-radius:6px;font-size:13px;font-weight:600;">Diligence Memo Preview</a>
                </td>
                <td>
                  <a href="${brandUrl}" style="display:inline-block;background:#f0f0f0;color:#333;text-decoration:none;padding:10px 18px;border-radius:6px;font-size:13px;font-weight:600;">Full Brand Page</a>
                </td>
              </tr>
            </table>

            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
            <p style="margin:0;color:#999;font-size:12px;line-height:1.5;">
              Questions? Reply to this email and we'll get back to you promptly.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Your ${reportName} for ${brandName} — Franchisel`,
      html,
    });

    if (error) {
      console.error("[email] sendReportPurchaseConfirmation error:", error);
      return { success: false, error: String(error) };
    }
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[email] sendReportPurchaseConfirmation threw:", msg);
    return { success: false, error: msg };
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
