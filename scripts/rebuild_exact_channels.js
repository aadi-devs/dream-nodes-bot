/**
 * Dream Nodes — Exact Channel Rebuild
 * Matches Veltrion Hosting layout precisely, adapted for Dream Nodes branding.
 * 
 * Category style:  ✦━━━ NAME ━━━✦
 * Channel prefix:  ・ (katakana middle dot U+30FB)
 * No emojis — only premium Unicode symbols
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const tokenMatch = envContent.match(/DISCORD_TOKEN=(.*)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';
const guildId = '1573272872737181696';

if (!token) {
  console.error("No token found");
  process.exit(1);
}

const sleep = ms => new Promise(res => setTimeout(res, ms));

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
    if (res.status === 429) {
      const data = await res.json();
      const retryAfter = (data.retry_after || 1) * 1000;
      console.log(`[Rate Limit] Waiting ${Math.round(retryAfter / 1000)}s...`);
      await sleep(retryAfter + 500);
      continue;
    }
    if (res.status === 204) return {};
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`API Error ${res.status}: ${err}`);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  }
}

// Permission: deny SEND_MESSAGES for @everyone
const READ_ONLY = [
  {
    id: guildId,
    type: 0,
    deny: '2048'
  }
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXACT CHANNEL LAYOUT (Veltrion → Dream Nodes)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// Veltrion uses ・ (U+30FB) as dot separator in channel names.
// Discord lowercases text channel names and converts spaces to hyphens.
// Category names preserve case and special chars.
//
// Channel types: 0 = text, 2 = voice, 5 = announcement
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const layout = [
  // ── Top-level (no category) ──
  {
    category: null,
    channels: [
      { name: '・dream-nodes',           type: 0, readOnly: true },
      { name: '・server-info',            type: 0, readOnly: true }
    ]
  },

  // ── GATEWAY ──
  {
    category: '✦━━━ GATEWAY ━━━✦',
    channels: [
      { name: '・welcome',                type: 0, readOnly: true },
      { name: '・dont-msg-here',          type: 0, readOnly: true },
      { name: '・terms-and-refund-policy', type: 0, readOnly: true }
    ]
  },

  // ── DREAM NODES (main announcements) ──
  {
    category: '✦━━━ DREAM NODES ━━━✦',
    channels: [
      { name: '・announcements',    type: 5, readOnly: true },
      { name: '・updates',          type: 5, readOnly: true },
      { name: '・changelogs',       type: 0, readOnly: true },
      { name: '・infrastructure',   type: 0, readOnly: true },
      { name: '・youtube-creators', type: 0, readOnly: true }
    ]
  },

  // ── MC PLANS ──
  {
    category: '✦━━━ MC PLANS ━━━✦',
    channels: [
      { name: '・intel-plans',     type: 0, readOnly: true },
      { name: '・amd-plans',       type: 0, readOnly: true },
      { name: '・singapore-plans', type: 0, readOnly: true },
      { name: '・offers',          type: 0, readOnly: true }
    ]
  },

  // ── VPS PLANS ──
  {
    category: '✦━━━ VPS PLANS ━━━✦',
    channels: [
      { name: '・intel-xeon-vps-plans', type: 0, readOnly: true },
      { name: '・amd-epyc-vps',         type: 0, readOnly: true },
      { name: '・singapore-intel-vps',   type: 0, readOnly: true },
      { name: '・singapore-amd-vps',     type: 0, readOnly: true },
      { name: '・auctions',              type: 5, readOnly: true }
    ]
  },

  // ── OTHER PLANS ──
  {
    category: '✦━━━ OTHER PLANS ━━━✦',
    channels: [
      { name: '・hosting-plans',   type: 0, readOnly: true },
      { name: '・grow-with-us',    type: 0, readOnly: true },
      { name: '・domain-plans',    type: 0, readOnly: true },
      { name: '・bot-hosting',     type: 0, readOnly: true },
      { name: '・rdp-plans',       type: 0, readOnly: true },
      { name: '・web-hosting',     type: 0, readOnly: true },
      { name: '・storage-servers', type: 0, readOnly: true },
      { name: '・other-offers',    type: 5, readOnly: true }
    ]
  },

  // ── FREE STUFF ──
  {
    category: '✦━━━ FREE STUFF ━━━✦',
    channels: [
      { name: '・invite-perks', type: 0, readOnly: true },
      { name: '・boost-perks',  type: 0, readOnly: true },
      { name: '・giveaways',    type: 0, readOnly: true }
    ]
  },

  // ── SUPPORT ──
  {
    category: '✦━━━ SUPPORT ━━━✦',
    channels: [
      { name: '・how-to-buy',    type: 0, readOnly: true },
      { name: '・create-ticket', type: 0, readOnly: false }
    ]
  },

  // ── COMMUNITY ──
  {
    category: '✦━━━ COMMUNITY ━━━✦',
    channels: [
      { name: '・bot-commands',           type: 0,  readOnly: false },
      { name: '✦ Music Area',            type: 2,  readOnly: false },
      { name: 'Dream Nodes - Official',  type: 2,  readOnly: false },
      { name: '✦ Waiting Area',          type: 2,  readOnly: false },
      { name: '✦ Support VC',            type: 2,  readOnly: false }
    ]
  },

  // ── Purchase Tickets (empty category) ──
  {
    category: 'Purchase Tickets',
    channels: []
  }
];

async function main() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   Dream Nodes — Exact Channel Rebuild    ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log("");

  // ── Phase 1: Delete ALL existing channels ──
  console.log("Phase 1: Deleting all existing channels...");
  const oldChannels = await apiRequest(`/guilds/${guildId}/channels`);
  console.log(`  Found ${oldChannels.length} channels to remove.`);

  // Delete non-categories first, then categories
  const nonCats = oldChannels.filter(c => c.type !== 4);
  const cats = oldChannels.filter(c => c.type === 4);

  for (const c of nonCats) {
    console.log(`  Deleting: ${c.name} (${c.type === 2 ? 'voice' : 'text'})`);
    await apiRequest(`/channels/${c.id}`, 'DELETE');
    await sleep(400);
  }
  for (const c of cats) {
    console.log(`  Deleting category: ${c.name}`);
    await apiRequest(`/channels/${c.id}`, 'DELETE');
    await sleep(400);
  }
  console.log("✓ All old channels deleted.\n");

  // ── Phase 2: Create new channels ──
  console.log("Phase 2: Creating exact channel structure...\n");

  const channelMap = {}; // Store created channel IDs for reference

  for (const section of layout) {
    let parentId = null;

    if (section.category) {
      console.log(`━━━ Creating category: "${section.category}" ━━━`);
      const cat = await apiRequest(`/guilds/${guildId}/channels`, 'POST', {
        name: section.category,
        type: 4
      });
      parentId = cat.id;
      console.log(`  ✓ Category created (ID: ${cat.id})`);
      await sleep(600);
    } else {
      console.log("━━━ Top-level channels (no category) ━━━");
    }

    for (const ch of section.channels) {
      const payload = {
        name: ch.name,
        type: ch.type,
        parent_id: parentId
      };
      if (ch.readOnly) {
        payload.permission_overwrites = READ_ONLY;
      }

      const created = await apiRequest(`/guilds/${guildId}/channels`, 'POST', payload);
      const displayType = ch.type === 0 ? 'text' : ch.type === 2 ? 'voice' : ch.type === 5 ? 'announcement' : `type-${ch.type}`;
      console.log(`  ✓ ${displayType}: ${created.name}`);
      
      // Store for reference
      channelMap[ch.name] = created.id;
      await sleep(600);
    }
    console.log("");
  }

  console.log("╔══════════════════════════════════════════╗");
  console.log("║     All channels created successfully!   ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log("");
  console.log("Channel ID reference:");
  for (const [name, id] of Object.entries(channelMap)) {
    console.log(`  ${name} → ${id}`);
  }
}

main().catch(err => {
  console.error("FATAL:", err);
  process.exit(1);
});
