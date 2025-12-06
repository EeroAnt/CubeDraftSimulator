import fs from 'fs';

export function saveDraftPool(seat, npcUUID) {
  const sortedCards = [...seat.main].sort((a, b) => {
    if (a.draft_pool !== b.draft_pool) {
      return a.draft_pool.localeCompare(b.draft_pool);
    }
    return a.name.localeCompare(b.name);
  });

  const content = sortedCards.map(card => `${card.draft_pool}: ${card.name}`).join('\n');
  
  const dir = './drafts';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(`${dir}/${npcUUID}.txt`, content);
  console.log(`Saved draft pool for ${npcUUID}`);
}