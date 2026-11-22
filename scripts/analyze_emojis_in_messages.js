const fs = require('fs');
const path = require('path');

const botEmojis = require('../data/bot_emojis.json');
const botEmojiIds = new Set(botEmojis.map(e => e.id));
const botEmojiNames = new Map(botEmojis.map(e => [e.name.toLowerCase(), e]));

const dir = path.join(__dirname, '..', 'data', 'live_messages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

const unicodeEmojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{FE0F}]/gu;
const customEmojiRegex = /<(a?):([a-zA-Z0-9_]+):([0-9]+)>/g;

files.forEach(f => {
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const text = JSON.stringify(data);
  
  // Find Unicode emojis
  const unicodeMatches = text.match(unicodeEmojiRegex) || [];
  
  // Find custom emojis
  const customMatches = [...text.matchAll(customEmojiRegex)];
  const missingFromBot = [];
  const validBotEmojis = [];
  
  for (const m of customMatches) {
    const [full, anim, name, id] = m;
    if (botEmojiIds.has(id)) {
      validBotEmojis.push(full);
    } else {
      missingFromBot.push(full);
    }
  }

  console.log(`=== ${f.replace('.json', '')} ===`);
  console.log(`  Unicode emojis count: ${unicodeMatches.length}`, [...new Set(unicodeMatches)].join(' '));
  console.log(`  Valid bot emojis: ${validBotEmojis.length}`);
  console.log(`  Unknown/Old emoji IDs: ${missingFromBot.length}`, [...new Set(missingFromBot)].slice(0, 5).join(' '));
});
