/**
 * Schema validation script — compares CMS Block definitions with scraped schema-suggestions.
 *
 * Usage:
 *   npx tsx scripts/validate-schemas.ts          # Local dev: exits 1 on errors
 *   npx tsx scripts/validate-schemas.ts --soft    # CI mode: emits ::warning annotations, exits 0
 *
 * Imports CMS Block definitions as plain TS objects (no Payload/DB needed),
 * loads corresponding schema-suggestion.json from scraping output,
 * and reports mismatches.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REF_DIR = path.resolve(__dirname, 'reference');
const CMS_BLOCKS_DIR = path.resolve(__dirname, '../apps/cms/src/blocks');

// ─── Types ─────────────────────────────────────────────────────────────────

interface PayloadField {
  name: string;
  type: string;
  fields?: PayloadField[];
  required?: boolean;
  options?: Array<{ label: string; value: string } | string>;
  defaultValue?: unknown;
  [key: string]: unknown;
}

interface SchemaSuggestionField {
  name: string;
  type: string;
  children?: SchemaSuggestionField[];
  options?: string[];
  required?: boolean;
}

interface SchemaSuggestion {
  fields: SchemaSuggestionField[];
  notes: string[];
}

interface BlockDefinition {
  slug: string;
  interfaceName: string;
  fields: PayloadField[];
  dbName?: string;
  [key: string]: unknown;
}

interface MismatchReport {
  slug: string;
  interfaceName: string;
  dbName?: string;
  missingInCms: string[];
  missingInSuggestion: string[];
  typeMismatches: Array<{
    field: string;
    cmsType: string;
    suggestedType: string;
  }>;
  notes: string[];
  status: 'ok' | 'warning' | 'error';
}

// ─── Field Type Mapping (Payload type → suggestion type) ───────────────────

const TYPE_EQUIVALENCES: Record<string, string[]> = {
  text: ['text', 'select'],
  textarea: ['textarea', 'text'],
  richText: ['richText'],
  upload: ['upload'],
  number: ['number', 'text'],
  select: ['select', 'text'],
  array: ['array'],
  group: ['group'],
  relationship: ['upload', 'relationship'],
  blocks: ['blocks'],
  checkbox: ['checkbox'],
  date: ['date', 'text'],
  email: ['email', 'text'],
  json: ['json'],
  radio: ['radio', 'select'],
  row: ['row'],
  collapsible: ['collapsible'],
  tabs: ['tabs'],
  code: ['code', 'text'],
  point: ['point'],
};

function typesAreCompatible(cmsType: string, suggestedType: string): boolean {
  const equivalences = TYPE_EQUIVALENCES[cmsType];
  if (!equivalences) return cmsType === suggestedType;
  return equivalences.includes(suggestedType);
}

// ─── Flatten CMS fields (skip layout-only fields like row, group etc) ──────

function flattenFields(fields: PayloadField[]): PayloadField[] {
  const result: PayloadField[] = [];
  for (const field of fields) {
    if (['row', 'collapsible', 'tabs'].includes(field.type)) {
      if (field.fields) {
        result.push(...flattenFields(field.fields));
      }
      // tabs may have nested tabs with fields
      if (field.type === 'tabs' && Array.isArray((field as any).tabs)) {
        for (const tab of (field as any).tabs) {
          if (tab.fields) {
            result.push(...flattenFields(tab.fields));
          }
        }
      }
    } else if (field.type === 'group') {
      // Keep the group but also note its children
      result.push(field);
    } else {
      result.push(field);
    }
  }
  return result;
}

// ─── Load Block Definitions ────────────────────────────────────────────────

async function loadBlockDefinitions(): Promise<BlockDefinition[]> {
  const blocks: BlockDefinition[] = [];

  async function scanDir(dir: string): Promise<void> {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await scanDir(fullPath);
      } else if (entry.name.endsWith('.ts') && !entry.name.startsWith('index')) {
        try {
          // Dynamic import of the block definition
          const mod = await import(fullPath);
          // Find the exported Block object
          for (const key of Object.keys(mod)) {
            const val = mod[key];
            if (val && typeof val === 'object' && 'slug' in val && 'fields' in val) {
              blocks.push(val as BlockDefinition);
            }
          }
        } catch (err) {
          console.warn(`  Could not import ${fullPath}: ${(err as Error).message}`);
        }
      }
    }
  }

  await scanDir(CMS_BLOCKS_DIR);
  return blocks;
}

// ─── Compare Block with Schema Suggestion ──────────────────────────────────

function compareBlock(
  block: BlockDefinition,
  suggestion: SchemaSuggestion,
): MismatchReport {
  const report: MismatchReport = {
    slug: block.slug,
    interfaceName: block.interfaceName,
    dbName: block.dbName,
    missingInCms: [],
    missingInSuggestion: [],
    typeMismatches: [],
    notes: [...suggestion.notes],
    status: 'ok',
  };

  const cmsFields = flattenFields(block.fields);
  const cmsFieldMap = new Map(cmsFields.map((f) => [f.name, f]));
  const suggestionFieldMap = new Map(suggestion.fields.map((f) => [f.name, f]));

  // Skip layout-only fields
  const skipFields = new Set(['layoutStyles']);

  // Check suggestion fields exist in CMS
  for (const [name, sugField] of suggestionFieldMap) {
    if (skipFields.has(name)) continue;
    const cmsField = cmsFieldMap.get(name);
    if (!cmsField) {
      report.missingInCms.push(`${name} (suggested: ${sugField.type})`);
    } else if (!typesAreCompatible(cmsField.type, sugField.type)) {
      report.typeMismatches.push({
        field: name,
        cmsType: cmsField.type,
        suggestedType: sugField.type,
      });
    }
  }

  // Check CMS fields exist in suggestion (informational — CMS may have extra admin fields)
  for (const [name, cmsField] of cmsFieldMap) {
    if (skipFields.has(name)) continue;
    if (!suggestionFieldMap.has(name)) {
      report.missingInSuggestion.push(`${name} (cms: ${cmsField.type})`);
    }
  }

  // Determine status
  if (report.missingInCms.length > 0 || report.typeMismatches.length > 0) {
    report.status = 'error';
  } else if (report.missingInSuggestion.length > 0) {
    report.status = 'warning';
  }

  return report;
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('Schema Validation Report');
  console.log('========================\n');

  // Load CMS block definitions
  console.log('Loading CMS block definitions...');
  const blocks = await loadBlockDefinitions();
  console.log(`  Found ${blocks.length} block definitions.\n`);

  // Check slug and interfaceName uniqueness
  const slugs = new Map<string, string>();
  const interfaces = new Map<string, string>();
  for (const block of blocks) {
    if (slugs.has(block.slug)) {
      console.error(`  DUPLICATE SLUG: "${block.slug}" in ${block.interfaceName} and ${slugs.get(block.slug)}`);
    }
    slugs.set(block.slug, block.interfaceName);

    if (interfaces.has(block.interfaceName)) {
      console.error(`  DUPLICATE INTERFACE: "${block.interfaceName}"`);
    }
    interfaces.set(block.interfaceName, block.slug);
  }

  // Compare with schema suggestions
  const reports: MismatchReport[] = [];
  let matched = 0;
  let unmatched = 0;

  for (const block of blocks) {
    const suggestionPath = path.join(REF_DIR, block.slug, 'schema-suggestion.json');
    if (!fs.existsSync(suggestionPath)) {
      unmatched++;
      continue;
    }

    matched++;
    const suggestion: SchemaSuggestion = JSON.parse(fs.readFileSync(suggestionPath, 'utf-8'));
    const report = compareBlock(block, suggestion);
    reports.push(report);
  }

  // Print report
  console.log(`Matched blocks: ${matched}/${blocks.length}`);
  console.log(`Missing schema suggestions: ${unmatched}\n`);

  const errors = reports.filter((r) => r.status === 'error');
  const warnings = reports.filter((r) => r.status === 'warning');
  const ok = reports.filter((r) => r.status === 'ok');

  if (errors.length > 0) {
    console.log(`\n❌ ERRORS (${errors.length} blocks):`);
    for (const r of errors) {
      console.log(`\n  ${r.slug} (${r.interfaceName})${r.dbName ? ` [dbName: ${r.dbName}]` : ''}`);
      if (r.missingInCms.length > 0) {
        console.log(`    Missing in CMS: ${r.missingInCms.join(', ')}`);
      }
      if (r.typeMismatches.length > 0) {
        for (const m of r.typeMismatches) {
          console.log(`    Type mismatch: "${m.field}" — CMS: ${m.cmsType}, Suggested: ${m.suggestedType}`);
        }
      }
      if (r.notes.length > 0) {
        console.log(`    Notes: ${r.notes.join('; ')}`);
      }
    }
  }

  if (warnings.length > 0) {
    console.log(`\n⚠ WARNINGS (${warnings.length} blocks):`);
    for (const r of warnings) {
      console.log(`\n  ${r.slug} (${r.interfaceName})`);
      if (r.missingInSuggestion.length > 0) {
        console.log(`    Extra CMS fields (not in suggestion): ${r.missingInSuggestion.join(', ')}`);
      }
    }
  }

  console.log(`\n✓ OK: ${ok.length} blocks`);
  console.log(`\nTotal: ${reports.length} blocks validated.`);

  // Write full report as JSON
  const reportPath = path.join(REF_DIR, 'validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(reports, null, 2));
  console.log(`\nFull report written to: ${reportPath}`);

  // In --soft mode (CI), emit GitHub Actions annotations and exit 0.
  // In default mode (local dev), exit 1 on errors for developer awareness.
  const softMode = process.argv.includes('--soft');

  if (errors.length > 0) {
    if (softMode) {
      for (const r of errors) {
        const details = [
          r.missingInCms.length > 0 ? `Missing in CMS: ${r.missingInCms.join(', ')}` : '',
          r.typeMismatches.length > 0 ? `Type mismatches: ${r.typeMismatches.map((m) => `${m.field} (${m.cmsType}→${m.suggestedType})`).join(', ')}` : '',
        ]
          .filter(Boolean)
          .join('. ');
        // Escape special chars for GitHub Actions workflow commands and truncate to annotation limit
        const escaped = details.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A').replace(/::/g, ': ');
        const truncated = escaped.length > 200 ? escaped.slice(0, 197) + '...' : escaped;
        console.log(`::warning title=Schema Mismatch (${r.slug})::${truncated}`);
      }
    } else {
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
