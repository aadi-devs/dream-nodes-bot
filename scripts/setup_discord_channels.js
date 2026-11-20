const fs = require('fs');
const path = require('path');

// Read token and guild id from .env
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const tokenMatch = envContent.match(/DISCORD_TOKEN=(.*)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';
const guildId = '1573272872737181696';

if (!token) {
  console.error("No token found in .env");
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
      console.log(`[Rate Limited] Waiting ${retryAfter}ms...`);
      await sleep(retryAfter + 200);
      continue;
    }
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`API Error ${res.status}: ${err}`);
    }
    return await res.json();
  }
}

// Permission bits
// SEND_MESSAGES = 1n << 11n (2048n)
// ADD_REACTIONS = 1n << 6n (64n)
const READ_ONLY_OVERWRITE = [
  {
    id: guildId, // @everyone role id equals guild id
    type: 0,     // role
    deny: '2048' // deny SEND_MESSAGES
  }
];

// Layout definition
const layout = [
  {
    category: null,
    channels: [
      { name: '☑-Ⓓ-•-ᴅʀᴇᴀᴍ-ɴᴏᴅᴇs', type: 0, readOnly: true },
      { name: '🛸・server-info', type: 0, readOnly: true }
    ]
  },
  {
    category: '✦----- GATEWAY -----✦',
    channels: [
      { name: '🛸・welcome', type: 0, readOnly: true },
      { name: '🛸・dont-msg-here', type: 0, readOnly: true },
      { name: '🛸・terms-and-refund-policy', type: 0, readOnly: true }
    ]
  },
  {
    category: '✦----- DREAM NODES -----✦',
    channels: [
      { name: '🛸・announcements', type: 0, readOnly: true },
      { name: '🛸・updates', type: 0, readOnly: true },
      { name: '🛸・changelogs', type: 0, readOnly: true },
      { name: '🛸・infrastructure', type: 0, readOnly: true },
      { name: '🛸・youtube-creators', type: 0, readOnly: true }
    ]
  },
  {
    category: '✦----- MC PLANS -----✦',
    channels: [
      { name: '🐴・intel-plans', type: 0, readOnly: true },
      { name: '🐴・amd-plans', type: 0, readOnly: true },
      { name: '🐴・singapore-plans', type: 0, readOnly: true },
      { name: '🐴・offers', type: 0, readOnly: true }
    ]
  },
  {
    category: '✦----- VPS PLANS -----✦',
    channels: [
      { name: '🐴・intel-xeon-vps-plans', type: 0, readOnly: true },
      { name: '🐴・amd-epyc-vps', type: 0, readOnly: true },
      { name: '🐴・singapore-intel-vps', type: 0, readOnly: true },
      { name: '🐴・singapore-amd-vps', type: 0, readOnly: true },
      { name: '🐴・auctions', type: 0, readOnly: true }
    ]
  },
  {
    category: '✦----- OTHER PLANS -----✦',
    channels: [
      { name: '🛸・hosting-plans', type: 0, readOnly: true },
      { name: '🛸・grow-with-us', type: 0, readOnly: true },
      { name: '⚜・domain-plans', type: 0, readOnly: true },
      { name: '⚜・bot-hosting', type: 0, readOnly: true },
      { name: '⚜・rdp-plans', type: 0, readOnly: true },
      { name: '⚜・web-hosting', type: 0, readOnly: true },
      { name: '⚜・storage-servers', type: 0, readOnly: true },
      { name: '⚜・other-offers', type: 0, readOnly: true }
    ]
  },
  {
    category: '✦----- FREE STUFF -----✦',
    channels: [
      { name: '➤・invite-perks', type: 0, readOnly: true },
      { name: '➤・boost-perks', type: 0, readOnly: true },
      { name: '➤・giveaways', type: 0, readOnly: true }
    ]
  },
  {
    category: '✦----- SUPPORT -----✦',
    channels: [
      { name: '⊘・how-to-buy', type: 0, readOnly: true },
      { name: '⊘・create-ticket', type: 0, readOnly: true }
    ]
  },
  {
    category: '✦----- COMMUNITY -----✦',
    channels: [
      { name: '✦・bot-commands', type: 0, readOnly: false },
      { name: '✦ MUSIC AREA', type: 2, readOnly: false },   // Voice
      { name: '✦ WAITINGAREA', type: 2, readOnly: false },  // Voice
      { name: '✦ SUPPORT VC', type: 2, readOnly: false }   // Voice
    ]
  },
  {
    category: 'Purchase Tickets',
    channels: []
  }
];

async function main() {
  console.log(`Setting up channels for guild: ${guildId}...`);

  for (const section of layout) {
    let parentId = null;

    if (section.category) {
      console.log(`\nCreating category: "${section.category}"...`);
      const cat = await apiRequest(`/guilds/${guildId}/channels`, 'POST', {
        name: section.category,
        type: 4 // GUILD_CATEGORY
      });
      parentId = cat.id;
      console.log(` Category created: ${cat.name} (${cat.id})`);
      await sleep(600);
    }

    for (const ch of section.channels) {
      console.log(`  Creating channel: "${ch.name}" (Type: ${ch.type})...`);
      const payload = {
        name: ch.name,
        type: ch.type,
        parent_id: parentId
      };
      if (ch.readOnly) {
        payload.permission_overwrites = READ_ONLY_OVERWRITE;
      }

      const created = await apiRequest(`/guilds/${guildId}/channels`, 'POST', payload);
      console.log(`    Created: ${created.name} (${created.id})`);
      await sleep(600);
    }
  }

  console.log("\nAll categories and channels created successfully!");
}

main().catch(err => {
  console.error("Setup failed:", err);
  process.exit(1);
});
