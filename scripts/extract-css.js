// Extract CSS values from Air Bank reference page
async function extractCSS(page) {
  const results = await page.evaluate(() => {
    const out = [];

    // Get all links that look like buttons (have border-radius)
    const links = document.querySelectorAll("a");
    for (const el of links) {
      const s = getComputedStyle(el);
      const text = el.textContent.trim().slice(0, 30);
      if (!text || text.length < 3 || s.borderRadius === "0px") continue;
      out.push("BTN: " + text + " | fs:" + s.fontSize + " | fw:" + s.fontWeight + " | color:" + s.color + " | bg:" + s.backgroundColor + " | radius:" + s.borderRadius + " | pad:" + s.padding);
      if (out.length >= 10) break;
    }

    // Get description paragraphs near hero headings
    const h1s = document.querySelectorAll("h1");
    for (const h of h1s) {
      const next = h.nextElementSibling;
      if (next && (next.tagName === "P" || next.tagName === "DIV")) {
        const s = getComputedStyle(next);
        const text = next.textContent.trim().slice(0, 40);
        out.push("DESC: " + text + " | fs:" + s.fontSize + " | fw:" + s.fontWeight + " | color:" + s.color + " | lh:" + s.lineHeight);
      }
    }

    return out.join("\n");
  });
  return results;
}

module.exports = extractCSS;


[Error: Failed query: ALTER TABLE "_pages_v_blocks_hero_block_links" ALTER COLUMN "appearance" SET DATA TYPE "public".
"enum__pages_v_blocks_hero_block_links_appearance" USING "appearance"::"public"."enum__pages_v_blocks_hero_block_links
_appearance";
params: ] {
  query: 'ALTER TABLE "_pages_v_blocks_hero_block_links" ALTER COLUMN "appearance" SET DATA TYPE "public"."enum__pages
_v_blocks_hero_block_links_appearance" USING "appearance"::"public"."enum__pages_v_blocks_hero_block_links_appearance"
;',
  params: [],
  payloadInitError: true,
  [cause]: [error: invalid input value for enum enum__pages_v_blocks_hero_block_links_appearance: "link"] {
    length: 135,
    severity: 'ERROR',
    code: '22P02',
    detail: undefined,
    hint: undefined,
    position: undefined,
    internalPosition: undefined,
    internalQuery: undefined,
    where: undefined,
    schema: undefined,
    table: undefined,
    column: undefined,
    dataType: undefined,
    constraint: undefined,
    file: 'enum.c',
    line: '129',
    routine: 'enum_in'
  }
}
