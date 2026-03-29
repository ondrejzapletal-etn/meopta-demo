#!/usr/bin/env npx tsx
/**
 * Meopta CMS Orchestrator
 *
 * Populates the CMS with all Meopta content in the correct order:
 *   1. Header (navigation)
 *   2. Footer
 *   3. Homepage
 *   4. Industrial & OEM pages
 *   5. Sport & Lifestyle pages
 *   6. Military Applications pages
 *   7. Corporate / About pages
 *   8. Support / Tools pages
 *
 * Usage:
 *   npx tsx scripts/populate-meopta.ts            # populate all
 *   npx tsx scripts/populate-meopta.ts --reset     # reset all pages then populate
 *   npx tsx scripts/populate-meopta.ts --dry-run   # dry-run all scripts
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const passthrough = args.filter((a) => a === '--reset' || a === '--dry-run').join(' ');

const SCRIPTS = [
  'populate-header.ts',
  'populate-footer.ts',
  'populate-meopta-homepage.ts',
  'populate-meopta-industrial.ts',
  'populate-meopta-sport.ts',
  'populate-meopta-military.ts',
  'populate-meopta-corporate.ts',
  'populate-meopta-support.ts',
];

async function main(): Promise<void> {
  console.log('=== Meopta CMS Population ===\n');

  let success = 0;
  let failed = 0;

  for (const script of SCRIPTS) {
    const scriptPath = path.join(__dirname, script);
    const cmd = `npx tsx "${scriptPath}" ${passthrough}`.trim();

    console.log(`\n──────────────────────────────────────`);
    console.log(`▶ Running: ${script} ${passthrough}`);
    console.log(`──────────────────────────────────────\n`);

    try {
      execSync(cmd, { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
      success++;
      console.log(`\n✓ ${script} completed successfully.`);
    } catch (err) {
      failed++;
      console.error(`\n✗ ${script} failed.`);
      if (!args.includes('--continue-on-error')) {
        console.error('Stopping. Use --continue-on-error to proceed past failures.');
        process.exit(1);
      }
    }
  }

  console.log(`\n══════════════════════════════════════`);
  console.log(`Meopta population complete.`);
  console.log(`  Success: ${success}/${SCRIPTS.length}`);
  if (failed > 0) console.log(`  Failed:  ${failed}/${SCRIPTS.length}`);
  console.log(`══════════════════════════════════════`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
