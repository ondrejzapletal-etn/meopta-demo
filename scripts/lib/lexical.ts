/**
 * Helpers to convert plain text / simple HTML into Payload CMS Lexical JSON.
 *
 * Payload uses Lexical rich-text editor. The format is:
 * { root: { type: 'root', children: [ ...paragraphs ], direction: 'ltr', format: '', indent: 0, version: 1 } }
 */

export interface LexicalNode {
  type: string;
  [key: string]: unknown;
}

export interface LexicalRoot {
  root: {
    type: 'root';
    children: LexicalNode[];
    direction: 'ltr' | 'rtl' | null;
    format: string;
    indent: number;
    version: number;
  };
}

function textNode(text: string, format: number = 0): LexicalNode {
  return {
    type: 'text',
    detail: 0,
    format,
    mode: 'normal',
    style: '',
    text,
    version: 1,
  };
}

function paragraphNode(children: LexicalNode[]): LexicalNode {
  return {
    type: 'paragraph',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    version: 1,
  };
}

function headingNode(
  children: LexicalNode[],
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
): LexicalNode {
  return {
    type: 'heading',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    tag,
    version: 1,
  };
}

function listItemNode(children: LexicalNode[], checked?: boolean): LexicalNode {
  return {
    type: 'listitem',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    value: 1,
    version: 1,
    ...(checked !== undefined ? { checked } : {}),
  };
}

function listNode(
  children: LexicalNode[],
  listType: 'bullet' | 'number' | 'check' = 'bullet',
): LexicalNode {
  return {
    type: 'list',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    listType,
    start: 1,
    tag: listType === 'number' ? 'ol' : 'ul',
    version: 1,
  };
}

function linkNode(children: LexicalNode[], url: string): LexicalNode {
  return {
    type: 'link',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 3,
    fields: {
      linkType: 'custom',
      newTab: false,
      url,
    },
  };
}

function tableCellNode(
  children: LexicalNode[],
  headerState: 0 | 1 = 0,
): LexicalNode {
  return {
    type: 'tablecell',
    children: children.length > 0 ? children : [paragraphNode([textNode('')])],
    direction: 'ltr',
    format: '',
    indent: 0,
    headerState,
    version: 1,
  };
}

function tableRowNode(children: LexicalNode[]): LexicalNode {
  return {
    type: 'tablerow',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  };
}

function tableNode(children: LexicalNode[]): LexicalNode {
  return {
    type: 'table',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  };
}

function wrapRoot(children: LexicalNode[]): LexicalRoot {
  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  };
}

/** Convert plain text string to Lexical JSON. Each line becomes a paragraph. */
export function textToLexical(text: string): LexicalRoot {
  const lines = text.split('\n').filter((l) => l.trim());
  const children = lines.map((line) => paragraphNode([textNode(line)]));
  return wrapRoot(children.length > 0 ? children : [paragraphNode([textNode(text || '')])]);
}

/** Convert simple HTML to Lexical JSON. Supports p, h1-h6, strong, em, a, ul/ol/li. */
export function htmlToLexical(html: string): LexicalRoot {
  const children: LexicalNode[] = [];

  // Strip outer wrappers
  let content = html.trim();

  // Split into block-level elements (table matched greedily due to nested tags)
  const blockRegex =
    /<(table)(?:\s[^>]*)?>[\s\S]*?<\/\1>|<(p|h[1-6]|ul|ol|div|li)(?:\s[^>]*)?>[\s\S]*?<\/\2>/gi;
  const blocks = content.match(blockRegex);

  if (!blocks || blocks.length === 0) {
    // No block elements found, treat as single paragraph
    const inlineText = stripTags(content);
    if (inlineText.trim()) {
      children.push(paragraphNode([textNode(inlineText)]));
    }
    return wrapRoot(
      children.length > 0 ? children : [paragraphNode([textNode('')])],
    );
  }

  for (const block of blocks) {
    const tagMatch = block.match(/^<(p|h[1-6]|ul|ol|div|li|table)/i);
    if (!tagMatch) continue;
    const tag = tagMatch[1]!.toLowerCase();

    if (tag === 'table') {
      children.push(parseTable(block));
    } else if (tag.startsWith('h')) {
      const inlineChildren = parseInlineContent(getInnerHtml(block));
      children.push(
        headingNode(inlineChildren, tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'),
      );
    } else if (tag === 'ul' || tag === 'ol') {
      const listType = tag === 'ol' ? 'number' : 'bullet';
      const itemRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      const items: LexicalNode[] = [];
      let itemMatch;
      while ((itemMatch = itemRegex.exec(block)) !== null) {
        const itemContent = parseInlineContent(itemMatch[1]!);
        items.push(listItemNode(itemContent));
      }
      if (items.length > 0) {
        children.push(listNode(items, listType));
      }
    } else {
      // p, div, li (standalone)
      const inlineChildren = parseInlineContent(getInnerHtml(block));
      if (inlineChildren.length > 0) {
        children.push(paragraphNode(inlineChildren));
      }
    }
  }

  return wrapRoot(
    children.length > 0 ? children : [paragraphNode([textNode('')])],
  );
}

function parseTable(html: string): LexicalNode {
  const rows: LexicalNode[] = [];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;
  let isFirstRow = true;

  while ((trMatch = trRegex.exec(html)) !== null) {
    const cells: LexicalNode[] = [];
    const cellRegex = /<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi;
    let cellMatch;

    while ((cellMatch = cellRegex.exec(trMatch[1]!)) !== null) {
      const isHeader = cellMatch[1]!.toLowerCase() === 'th' || isFirstRow;
      const cellContent = cellMatch[2]!.trim();
      // Cell may contain block elements (h5, p) or just inline content
      const innerBlocks = cellContent.match(/<(p|h[1-6])[^>]*>[\s\S]*?<\/\1>/gi);
      let cellChildren: LexicalNode[];
      if (innerBlocks && innerBlocks.length > 0) {
        cellChildren = [];
        for (const innerBlock of innerBlocks) {
          const innerTag = innerBlock.match(/^<(p|h[1-6])/i)?.[1]?.toLowerCase();
          if (innerTag?.startsWith('h')) {
            cellChildren.push(headingNode(
              parseInlineContent(getInnerHtml(innerBlock)),
              innerTag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
            ));
          } else {
            cellChildren.push(paragraphNode(parseInlineContent(getInnerHtml(innerBlock))));
          }
        }
      } else {
        const inlineContent = parseInlineContent(cellContent);
        cellChildren = [paragraphNode(inlineContent.length > 0 ? inlineContent : [textNode('')])];
      }
      cells.push(tableCellNode(cellChildren, isHeader ? 1 : 0));
    }

    if (cells.length > 0) {
      rows.push(tableRowNode(cells));
    }
    isFirstRow = false;
  }

  return tableNode(rows);
}

function getInnerHtml(element: string): string {
  const match = element.match(/^<[^>]+>([\s\S]*)<\/[^>]+>$/);
  return match ? match[1]! : element;
}

function parseInlineContent(html: string): LexicalNode[] {
  const nodes: LexicalNode[] = [];
  let remaining = html;

  while (remaining.length > 0) {
    // Check for <strong>/<b>
    const boldMatch = remaining.match(
      /^([\s\S]*?)<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/i,
    );
    if (boldMatch) {
      if (boldMatch[1]) {
        const text = stripTags(boldMatch[1]);
        if (text) nodes.push(textNode(text));
      }
      const boldText = stripTags(boldMatch[2]!);
      if (boldText) nodes.push(textNode(boldText, 1)); // format: 1 = bold
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Check for <em>/<i>
    const italicMatch = remaining.match(
      /^([\s\S]*?)<(?:em|i)[^>]*>([\s\S]*?)<\/(?:em|i)>/i,
    );
    if (italicMatch) {
      if (italicMatch[1]) {
        const text = stripTags(italicMatch[1]);
        if (text) nodes.push(textNode(text));
      }
      const italicText = stripTags(italicMatch[2]!);
      if (italicText) nodes.push(textNode(italicText, 2)); // format: 2 = italic
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Check for <a>
    const linkMatch = remaining.match(
      /^([\s\S]*?)<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i,
    );
    if (linkMatch) {
      if (linkMatch[1]) {
        const text = stripTags(linkMatch[1]);
        if (text) nodes.push(textNode(text));
      }
      const linkText = stripTags(linkMatch[3]!);
      if (linkText) {
        nodes.push(linkNode([textNode(linkText)], linkMatch[2]!));
      }
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Check for <br>
    const brMatch = remaining.match(/^([\s\S]*?)<br\s*\/?>/i);
    if (brMatch) {
      if (brMatch[1]) {
        const text = stripTags(brMatch[1]);
        if (text) nodes.push(textNode(text));
      }
      nodes.push({ type: 'linebreak', version: 1 });
      remaining = remaining.slice(brMatch[0].length);
      continue;
    }

    // No more inline elements, consume rest as text
    const text = stripTags(remaining);
    if (text) nodes.push(textNode(text));
    break;
  }

  return nodes;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function uploadNode(mediaId: number): LexicalNode {
  return {
    type: 'upload',
    format: '',
    version: 3,
    id: crypto.randomUUID(),
    fields: null,
    relationTo: 'media',
    value: mediaId,
  };
}

export { wrapRoot, paragraphNode, textNode, headingNode, listNode, listItemNode, linkNode, uploadNode, tableNode, tableRowNode, tableCellNode };
