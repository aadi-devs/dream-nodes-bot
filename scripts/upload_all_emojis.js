const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const token = envContent.match(/DISCORD_TOKEN=(.*)/)[1].trim();
const guildId = '1573272872737181696';

const EMOJIS_DIR = path.join('c:', 'Vichost', 'emojis', 'Emojis');

const sleep = ms => new Promise(res => setTimeout(res, ms));

// Exclude inappropriate or competitor files
const EXCLUDED_FILES = new Set([
  'veltrion.png',
  'gaand.png',
  'z_Oggycafe_sexy.png'
]);

function sanitizeName(filename) {
  const base = path.parse(filename).name;
  let clean = base.replace(/[^a-zA-Z0-9_]/g, '_');
  clean = clean.replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  if (clean.length < 2) clean = `e_${clean}`;
  return clean.slice(0, 32);
}

async function apiRequest(endpoint, method = 'GET', body = null) {
  const url = `https://discord.com/api/v10${endpoint}`;
  const options = {
    method,
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    }
  };
  if (body) options.body = JSON.stringify(body);

  while (true) {
    const res = await fetch(url, options);
    
    // Rate limit handling
    if (res.status === 429) {
      const data = await res.json();
      const retryAfter = (data.retry_after || 1.5) * 1000;
      console.log(`  [Rate Limit] Waiting ${(retryAfter / 1000).toFixed(1)}s...`);
      await sleep(retryAfter + 300);
      continue;
    }

    if (res.status === 204) return {};
    
    if (!res.ok) {
      const errText = await res.text();
      let errJson = {};
      try { errJson = JSON.parse(errText); } catch(e) {}
      
      // Slot limit reached (Code 30008)
      if (res.status === 400 && (errJson.code === 30008 || errText.includes('Maximum number of emojis reached'))) {
        return { slotLimitReached: true, error: errText };
      }
      
      throw new Error(`API ${res.status}: ${errText}`);
    }

    return await res.json();
  }
}

async function main() {
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║         Dream Nodes — Discord Emoji Uploader           ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  // 1. Fetch existing emojis
  console.log("Fetching existing server emojis...");
  const existingEmojis = await apiRequest(`/guilds/${guildId}/emojis`);
  const existingNames = new Set(existingEmojis.map(e => e.name.toLowerCase()));
  console.log(`Server already has ${existingEmojis.length} emojis:`);
  console.log(`  - Animated: ${existingEmojis.filter(e => e.animated).length}`);
  console.log(`  - Static:   ${existingEmojis.filter(e => !e.animated).length}\n`);

  // 2. Discover files
  const allFiles = fs.readdirSync(EMOJIS_DIR);
  
  // Separate into GIF (animated) and PNG (static)
  const gifFiles = allFiles
    .filter(f => f.toLowerCase().endsWith('.gif') && !EXCLUDED_FILES.has(f))
    .sort();

  // Hosting / high-value static emojis prioritized
  const hostingStaticOrder = [
    'cpu.png', 'RAM.png', 'disk.png', 'vps.png', 'backup.png', 'bandwith55.png',
    'support.png', 'ticket.png', 'amd.png', 'intel.png', 'website.png', 'youtube.png',
    'RULES.png', 'Private.png', 'Diamond.png', 'Offer.png', 'money.png', 'crush_goodping.png',
    'mcheart.png', 'netherite.png', 'gold_block.png', 'iron.png', 'lapisblock.png',
    'redstone.png', 'coal.png', 'stone.png', 'dirt.png'
  ];

  const staticFiles = allFiles
    .filter(f => f.toLowerCase().endsWith('.png') && !EXCLUDED_FILES.has(f))
    .sort((a, b) => {
      const idxA = hostingStaticOrder.indexOf(a);
      const idxB = hostingStaticOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

  console.log(`Found ${gifFiles.length} animated GIFs and ${staticFiles.length} static PNGs.`);
  console.log("Prioritizing ALL animated GIFs first, followed by top hosting emojis.\n");

  // Build upload queue
  const queue = [
    ...gifFiles.map(f => ({ file: f, isAnimated: true })),
    ...staticFiles.map(f => ({ file: f, isAnimated: false }))
  ];

  let uploadedCount = 0;
  let animatedUploaded = 0;
  let staticUploaded = 0;
  let skippedCount = 0;

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    const emojiName = sanitizeName(item.file);
    const filePath = path.join(EMOJIS_DIR, item.file);

    // Skip if already in server
    if (existingNames.has(emojiName.toLowerCase())) {
      console.log(`[${i + 1}/${queue.length}] [SKIP] "${emojiName}" already exists on server.`);
      skippedCount++;
      continue;
    }

    const fileBuf = fs.readFileSync(filePath);
    const mimeType = item.isAnimated ? 'image/gif' : 'image/png';
    const dataUri = `data:${mimeType};base64,${fileBuf.toString('base64')}`;
    const sizeKb = (fileBuf.length / 1024).toFixed(1);

    console.log(`[${i + 1}/${queue.length}] Uploading ${item.isAnimated ? '🎬 [GIF]' : '🖼️ [PNG]'} "${emojiName}" (${sizeKb} KB)...`);

    try {
      const result = await apiRequest(`/guilds/${guildId}/emojis`, 'POST', {
        name: emojiName,
        image: dataUri
      });

      if (result.slotLimitReached) {
        console.log(`\n⚠️  [SLOT LIMIT REACHED] Server emoji limit reached for ${item.isAnimated ? 'animated' : 'static'} emojis!`);
        if (item.isAnimated) {
          console.log("Switching to static emoji queue...");
          continue;
        } else {
          console.log("All slots full. Finishing up.");
          break;
        }
      }

      console.log(`  ✓ Uploaded successfully (ID: ${result.id})`);
      existingNames.add(emojiName.toLowerCase());
      uploadedCount++;
      if (item.isAnimated) animatedUploaded++;
      else staticUploaded++;

      // Gentle pause to avoid triggering Discord's strict burst rate limits
      await sleep(1100);
    } catch (err) {
      console.error(`  ✗ Error uploading "${emojiName}": ${err.message}`);
      await sleep(1500);
    }
  }

  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║                 Upload Summary Report                  ║");
  console.log("╚════════════════════════════════════════════════════════╝");
  console.log(`Total New Emojis Uploaded: ${uploadedCount}`);
  console.log(`  • Animated GIFs: ${animatedUploaded}`);
  console.log(`  • Static PNGs:   ${staticUploaded}`);
  console.log(`Skipped (already on server): ${skippedCount}`);
  
  // Final count
  const finalEmojis = await apiRequest(`/guilds/${guildId}/emojis`);
  console.log(`\nServer now has ${finalEmojis.length} total emojis:`);
  console.log(`  • Animated: ${finalEmojis.filter(e => e.animated).length} / 50`);
  console.log(`  • Static:   ${finalEmojis.filter(e => !e.animated).length} / 50`);
}

main().catch(err => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
