export interface ParsedBlock {
  blockType: string;
  data: Record<string, unknown>;
  images: Array<{ fieldPath: string; url: string; alt: string }>;
  svgs: Array<{ fieldPath: string; content: string; name: string }>;
}

export type ParserFunction = (html: string) => ParsedBlock;
