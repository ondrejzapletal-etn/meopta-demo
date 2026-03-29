import { findCollectionItems, deleteCollectionItem } from './lib/cms-api.js';

async function main() {
  let total = 0;

  while (true) {
    const data = await findCollectionItems(
      'media',
      'where[sourceHash][exists]=false&limit=100&depth=0',
    );
    if (!data.docs.length) break;

    for (const doc of data.docs) {
      try {
        await deleteCollectionItem('media', doc.id);
        total++;
        console.log(`Smazáno médium ID ${doc.id}`);
      } catch (err) {
        console.warn(`Nepodařilo se smazat médium ID ${doc.id}:`, err);
      }
    }
  }

  console.log(`\nHotovo. Celkem smazáno: ${total} médií bez sourceHash.`);
}

main();
