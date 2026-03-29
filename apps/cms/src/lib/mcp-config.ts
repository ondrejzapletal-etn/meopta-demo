/**
 * Shared MCP access configuration.
 *
 * Single source of truth for which collections/globals are exposed via MCP
 * and with which operations. Used by both:
 * - payload.config.ts (mcpPlugin)
 * - api/mcp/route.ts  (custom tool registration)
 */

export type CollectionOps = {
  find?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
};

export type GlobalOps = {
  find?: boolean;
  update?: boolean;
};

export const MCP_COLLECTIONS: Record<string, CollectionOps> = {
  pages: { find: true, create: true, update: true, delete: true },
  articles: { find: true, create: true, update: true, delete: true },
  media: { find: true, create: true },
  assets: { find: true },
  categories: { find: true, create: true, update: true, delete: true },
};

export const MCP_GLOBALS: Record<string, GlobalOps> = {
  header: { find: true, update: true },
  footer: { find: true, update: true },
  settings: { find: true },
};
