/**
 * FDD Archive Manager
 *
 * Internal-only utility for managing the private FDD PDF archive.
 * This code is for CLI/build-time use — NEVER imported by the Next.js app.
 *
 * The archive stores government-filed FDD PDFs locally so we can:
 * 1. Prove what a document said if our extraction is challenged
 * 2. Re-extract data if we improve our extraction logic
 * 3. Survive state site downtime or URL changes
 *
 * PDFs in the archive are NEVER served to users.
 */

import { createHash } from "crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import type { FDDSource, FDDFilingReference, FDDFilingRegistry } from "./fdd-types";

const VAULT_ROOT = join(process.cwd(), "fdd-vault");

/** Get the archive directory for a given source */
function getArchiveDir(source: FDDSource): string {
  const dirMap: Record<FDDSource, string> = {
    mn_cards: "mn-cards",
    wi_dfi: "wi-dfi",
    ca_dfpi: "ca-dfpi",
  };
  const dir = join(VAULT_ROOT, dirMap[source], "archive");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

/** Get the registry directory for a given source */
function getRegistryDir(source: FDDSource): string {
  const dirMap: Record<FDDSource, string> = {
    mn_cards: "mn-cards",
    wi_dfi: "wi-dfi",
    ca_dfpi: "ca-dfpi",
  };
  const dir = join(VAULT_ROOT, dirMap[source], "registry");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

/** Compute SHA-256 hash of a file */
export function hashFile(filePath: string): string {
  const content = readFileSync(filePath);
  return createHash("sha256").update(content).digest("hex");
}

/**
 * Archive a downloaded PDF.
 * Returns the archive path and hash for storing in FDDFilingReference.
 */
export function archivePdf(
  source: FDDSource,
  stateFileNumber: string,
  fddYear: number,
  pdfBuffer: Buffer
): { archivePath: string; hash: string } {
  const dir = getArchiveDir(source);
  // Filename: source-fileNumber-year.pdf
  const safeFileNum = stateFileNumber.replace(/[^a-zA-Z0-9-]/g, "_");
  const filename = `${source}-${safeFileNum}-${fddYear}.pdf`;
  const archivePath = join(dir, filename);

  writeFileSync(archivePath, pdfBuffer);

  const hash = createHash("sha256").update(pdfBuffer).digest("hex");

  return { archivePath, hash };
}

/**
 * Load the filing registry for a source.
 * Returns empty registry if none exists.
 */
export function loadRegistry(source: FDDSource): FDDFilingRegistry {
  const dir = getRegistryDir(source);
  const registryPath = join(dir, "registry.json");

  if (existsSync(registryPath)) {
    const raw = readFileSync(registryPath, "utf-8");
    return JSON.parse(raw) as FDDFilingRegistry;
  }

  return {
    lastUpdated: new Date().toISOString().split("T")[0],
    totalFilings: 0,
    totalFranchisors: 0,
    filings: [],
  };
}

/**
 * Save the filing registry for a source.
 */
export function saveRegistry(source: FDDSource, registry: FDDFilingRegistry): void {
  const dir = getRegistryDir(source);
  const registryPath = join(dir, "registry.json");

  registry.lastUpdated = new Date().toISOString().split("T")[0];
  registry.totalFilings = registry.filings.length;

  // Count unique franchisors by stateFileNumber prefix
  const uniqueFranchisors = new Set(
    registry.filings.map((f) => f.stateFileNumber.split("-")[0])
  );
  registry.totalFranchisors = uniqueFranchisors.size;

  writeFileSync(registryPath, JSON.stringify(registry, null, 2));
}

/**
 * Add a filing to the registry (deduplicates by stateFileNumber + source).
 */
export function addFiling(
  source: FDDSource,
  filing: FDDFilingReference
): void {
  const registry = loadRegistry(source);

  // Deduplicate: same source + file number = same filing
  const exists = registry.filings.some(
    (f) =>
      f.source === filing.source &&
      f.stateFileNumber === filing.stateFileNumber
  );

  if (!exists) {
    registry.filings.push(filing);
    saveRegistry(source, registry);
  }
}

/**
 * Get a filing by state file number.
 */
export function getFiling(
  source: FDDSource,
  stateFileNumber: string
): FDDFilingReference | null {
  const registry = loadRegistry(source);
  return (
    registry.filings.find(
      (f) => f.stateFileNumber === stateFileNumber
    ) ?? null
  );
}

/**
 * Verify archive integrity — check that all archived PDFs match their stored hashes.
 */
export function verifyArchiveIntegrity(source: FDDSource): {
  total: number;
  verified: number;
  corrupted: string[];
  missing: string[];
} {
  const registry = loadRegistry(source);
  let verified = 0;
  const corrupted: string[] = [];
  const missing: string[] = [];

  for (const filing of registry.filings) {
    if (!filing.internalArchivePath) continue;

    if (!existsSync(filing.internalArchivePath)) {
      missing.push(filing.stateFileNumber);
      continue;
    }

    if (filing.archiveHash) {
      const actualHash = hashFile(filing.internalArchivePath);
      if (actualHash === filing.archiveHash) {
        verified++;
      } else {
        corrupted.push(filing.stateFileNumber);
      }
    }
  }

  return {
    total: registry.filings.filter((f) => f.internalArchivePath).length,
    verified,
    corrupted,
    missing,
  };
}

/**
 * Print archive summary for a source.
 */
export function printArchiveSummary(source: FDDSource): void {
  const registry = loadRegistry(source);
  const archived = registry.filings.filter((f) => f.internalArchivePath).length;

  console.log(`\n=== ${source.toUpperCase()} Archive ===`);
  console.log(`Total filings cataloged: ${registry.totalFilings}`);
  console.log(`Unique franchisors: ${registry.totalFranchisors}`);
  console.log(`PDFs archived internally: ${archived}`);
  console.log(`Last updated: ${registry.lastUpdated}`);

  if (archived > 0) {
    const integrity = verifyArchiveIntegrity(source);
    console.log(`Archive integrity: ${integrity.verified}/${integrity.total} verified`);
    if (integrity.corrupted.length > 0) {
      console.log(`  CORRUPTED: ${integrity.corrupted.join(", ")}`);
    }
    if (integrity.missing.length > 0) {
      console.log(`  MISSING: ${integrity.missing.join(", ")}`);
    }
  }
}
