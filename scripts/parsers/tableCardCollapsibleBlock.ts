import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Cenik';

  const sections: Array<{
    sectionTitle: string;
    rows: Array<{ label: string; value: string }>;
  }> = [];

  const firstH4 = $('h4').first();
  if (firstH4.length) {
    const groupDiv = firstH4.parent().parent().parent().parent();
    const groupsParent = groupDiv.parent();

    groupsParent.children().each((_, group) => {
      const $group = $(group);
      const children = $group.children();
      const headerChild = children.first();
      const sectionTitle = headerChild.find('h4').first().text().trim() || 'Sekce';

      const rows: Array<{ label: string; value: string }> = [];
      children.each((j, kid) => {
        if (j === 0) return;
        const $kid = $(kid);
        const label = $kid.find('p').first().text().trim();
        const value = $kid.find('span').first().text().trim();
        if (label) {
          rows.push({ label, value });
        }
      });

      if (rows.length > 0) {
        sections.push({ sectionTitle, rows });
      }
    });
  }

  return {
    blockType: 'tableCardCollapsibleBlock',
    data: {
      title,
      sections,
    },
    images: [],
    svgs: [],
  };
}
