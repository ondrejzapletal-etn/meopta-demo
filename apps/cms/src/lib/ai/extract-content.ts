/**
 * Content extraction utilities for AI context building.
 *
 * Extracts plain text from Payload CMS data structures so LLM prompts
 * receive meaningful context without needing to understand block schemas.
 */

const TEXT_FIELDS = [
  'title',
  'heading',
  'subheading',
  'subtitle',
  'description',
  'text',
  'content',
  'label',
  'body',
  'lead',
  'caption',
  'summary',
] as const;

const MAX_CONTEXT_CHARS = 1200;

// ---------------------------------------------------------------------------
// Lexical rich text
// ---------------------------------------------------------------------------

/**
 * Recursively walks a Lexical JSON tree and collects text node values.
 */
function walkLexicalNode(node: unknown, acc: string[]): void {
  if (!node || typeof node !== 'object') return;
  const n = node as Record<string, unknown>;

  if (n.type === 'text' && typeof n.text === 'string' && n.text.trim()) {
    acc.push(n.text.trim());
  }

  if (Array.isArray(n.children)) {
    for (const child of n.children) walkLexicalNode(child, acc);
  }
}

export function extractTextFromLexical(lexical: unknown): string {
  if (!lexical || typeof lexical !== 'object') return '';
  const root = (lexical as Record<string, unknown>).root;
  const acc: string[] = [];
  walkLexicalNode(root, acc);
  return acc.join(' ').slice(0, MAX_CONTEXT_CHARS);
}

// ---------------------------------------------------------------------------
// Block arrays (Pages)
// ---------------------------------------------------------------------------

/**
 * Recursively extracts strings from known text fields in a value tree.
 */
function extractStringsFromValue(value: unknown, acc: string[]): void {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed) acc.push(trimmed);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) extractStringsFromValue(item, acc);
    return;
  }

  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    // If it looks like Lexical, use specialized extractor
    if (obj.root && typeof obj.root === 'object') {
      const text = extractTextFromLexical(value);
      if (text) acc.push(text);
      return;
    }
    for (const key of TEXT_FIELDS) {
      if (key in obj) extractStringsFromValue(obj[key], acc);
    }
  }
}

export function extractTextFromBlocks(blocks: unknown[]): string {
  const acc: string[] = [];
  for (const block of blocks) {
    extractStringsFromValue(block, acc);
    if (acc.join(' ').length >= MAX_CONTEXT_CHARS) break;
  }
  return acc.join(' ').slice(0, MAX_CONTEXT_CHARS);
}

// ---------------------------------------------------------------------------
// Unified context builder
// ---------------------------------------------------------------------------

/**
 * Produces a plain-text content string from a Payload doc based on its collection.
 *
 * - Pages: extracts text from `doc.layout` blocks
 * - Articles: extracts text from `doc.content` (Lexical)
 * - Unknown collections: falls back to empty string
 */
export function prepareDocumentContext(doc: Record<string, unknown>, collectionSlug: string): string {
  if (collectionSlug === 'pages') {
    const layout = doc.layout;
    return Array.isArray(layout) ? extractTextFromBlocks(layout) : '';
  }

  if (collectionSlug === 'articles') {
    return extractTextFromLexical(doc.content);
  }

  return '';
}
