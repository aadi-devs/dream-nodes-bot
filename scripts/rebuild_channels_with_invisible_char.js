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
const inv = 'ㅤ\u17b5'; // User's Hangul filler + invisible spacer

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
      console.log(`[Rate Limit] Waiting ${retryAfter}ms...`);
      await sleep(retryAfter + 300);
      continue;
    }
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`API Error ${res.status}: ${err}`);
    }
    return await res.json();
  }
}

const READ_ONLY_OVERWRITE = [
  {
    id: guildId,
    type: 0,
    deny: '2048'
  }
];

const layout = [
  {
    category: null,
    channels: [
      { name: `☑${inv}Ⓓ${inv}•${inv}ᴅʀᴇᴀᴍ-ɴᴏᴅᴇs`, type: 0, readOnly: true },
      { name: `☁${inv}•${inv}ꜱᴇʀᴠᴇʀ-ɪɴꜰᴏ`, type: 0, readOnly: true }
    ]
  },
  {
    category: '✦----- GATEWAY -----✦',
    channels: [
      { name: `☁${inv}•${inv}ᴡᴇʟᴄᴏᴍᴇ`, type: 0, readOnly: true },
      { name: `☁${inv}•${inv}ᴅᴏɴᴛ-ᴍꜱɢ-ʜᴇʀᴇ`, type: 0, readOnly: true },
      { name: `☁${inv}•${inv}ᴛᴇʀᴍꜱ-ᴀɴᴅ-ʀᴇꜰᴜɴᴅ-ᴘᴏʟɪᴄʏ`, type: 0, readOnly: true }
    ]
  },
  {
    category: '✦----- DREAM NODES -----✦',
    channels: [
      { name: `☁${inv}•${inv}ᴀɴɴᴏᴜɴᴄᴇᴍᴇɴᴛꜱ`, type: 0, readOnly: true },
      { name: `☁${inv}•${inv}ᴜᴘᴅᴀᴛᴇꜱ`, type: 0, readOnly: true },
      { name: `☁${inv}•${inv}ᴄʜᴀɴɢᴇʟᴏɢꜱ`, type: 0, readOnly: true },
      { name: `☁${inv}•${inv}ɪɴꜰʀᴀꜱᴛʀᴜᴄᴛᴜʀᴇ`, type: 0, readOnly: true },
      { name: `☁${inv}•${inv}ʏᴏᴜᴛᴜʙᴇ-ᴄʀᴇᴀᴛᴏʀꜱ`, type: 0, readOnly: true }
    ]
  },
  {
    category: '✦----- MC PLANS -----✦',
    channels: [
      { name: `♘${inv}•${inv}ɪɴᴛᴇʟ-ᴘʟᴀɴꜱ`, type: 0, readOnly: true },
      { name: `♘${inv}•${inv}ᴀᴍᴅ-ᴘʟᴀɴꜱ`, type: 0, readOnly: true },
      { name: `♘${inv}•${inv}ꜱɪɴɢᴀᴘᴏʀᴇ-ᴘʟᴀɴꜱ`, type: 0, readOnly: true },
      { name: `♘${inv}•${inv}ᴏꜰꜰᴇʀꜱ`, type: 0, readOnly: true }
    ]
  },
  {
    category: '✦----- VPS PLANS -----✦',
    channels: [
      { name: `♘${inv}•${inv}ɪɴᴛᴇʟ-xᴇᴏɴ-ᴠᴘꜱ-ᴘʟᴀɴꜱ`, type: 0, readOnly: true },
      { name: `♘${inv}•${inv}ᴀᴍᴅ-ᴇᴘʏᴄ-ᴠᴘꜱ`, type: 0, readOnly: true },
      { name: `♘${inv}•${inv}ꜱɪɴɢᴀᴘᴏʀᴇ-ɪɴᴛᴇʟ-ᴠᴘꜱ`, type: 0, readOnly: true },
      { name: `♘${inv}•${inv}ꜱɪɴɢᴀᴘᴏʀᴇ-ᴀᴍᴅ-ᴠᴘꜱ`, type: 0, readOnly: true },
      { name: `♘${inv}•${inv}ᴀᴜᴄᴛɪᴏɴꜱ`, type: 0, readOnly: true }
    ]
  },
  {
    category: '✦----- OTHER PLANS -----✦',
    channels: [
      { name: `☁${inv}•${inv}ʜᴏꜱᴛɪɴɢ-ᴘʟᴀɴꜱ`, type: 0, readOnly: true },
      { name: `☁${inv}•${inv}ɢʀᴏᴡ-ᴡɪᴛʜ-ᴜꜱ`, type: 0, readOnly: true },
      { name: `⚜${inv}•${inv}ᴅᴏᴍᴀɪɴ-ᴘʟᴀɴꜱ`, type: 0, readOnly: true },
      { name: `⚜${inv}•${inv}ʙᴏᴛ-ʜᴏꜱᴛɪɴɢ`, type: 0, readOnly: true },
      { name: `⚜${inv}•${inv}ʀᴅᴘ-ᴘʟᴀɴꜱ`, type: 0, readOnly: true },
      { name: `⚜${inv}•${inv}ᴡᴇʙ-ʜᴏꜱᴛɪɴɢ`, type: 0, readOnly: true },
      { name: `⚜${inv}•${inv}ꜱᴛᴏʀᴀɢᴇ-ꜱᴇʀᴠᴇʀꜱ`, type: 0, readOnly: true },
      { name: `⚜${inv}•${inv}ᴏᴛʜᴇʀ-ᴏꜰꜰᴇʀꜱ`, type: 0, readOnly: true }
    ]
  },
  {
    category: '✦----- FREE STUFF -----✦',
    channels: [
      { name: `➤${inv}•${inv}ɪɴᴠɪᴛᴇ-ᴘᴇʀᴋꜱ`, type: 0, readOnly: true },
      { name: `➤${inv}•${inv}ʙᴏᴏꜱᴛ-ᴘᴇʀᴋꜱ`, type: 0, readOnly: true },
      { name: `➤${inv}•${inv}ɢɪᴠᴇᴀᴡᴀʏꜱ`, type: 0, readOnly: true }
    ]
  },
  {
    category: '✦----- SUPPORT -----✦',
    channels: [
      { name: `⊘${inv}•${inv}ʜᴏᴡ-ᴛᴏ-ʙᴜʏ`, type: 0, readOnly: true },
      { name: `⊘${inv}•${inv}ᴄʀᴇᴀᴛᴇ-ᴛɪᴄᴋᴇᴛ`, type: 0, readOnly: true }
    ]
  },
  {
    category: '✦----- COMMUNITY -----✦',
    channels: [
      { name: `✦${inv}•${inv}ʙᴏᴛ-ᴄᴏᴍᴍᴀɴᴅꜱ`, type: 0, readOnly: false },
      { name: '✦ MUSIC AREA', type: 2, readOnly: false },
      { name: '✦ WAITINGAREA', type: 2, readOnly: false },
      { name: '✦ SUPPORT VC', type: 2, readOnly: false }
    ]
  },
  {
    category: 'Purchase Tickets',
    channels: []
  }
];

async function main() {
  console.log("Cleaning old channels first...");
  const oldChannels = await apiRequest(`/guilds/${guildId}/channels`);
  const nonCats = oldChannels.filter(c => c.type !== 4);
  const cats = oldChannels.filter(c => c.type === 4);

  for (const c of nonCats) {
    await apiRequest(`/channels/${c.id}`, 'DELETE');
    await sleep(350);
  }
  for (const c of cats) {
    await apiRequest(`/channels/${c.id}`, 'DELETE');
    await sleep(350);
  }
  console.log("Old channels cleaned!");

  console.log("\nCreating fresh channels with invisible spacing (no hyphens)...");
  for (const section of layout) {
    let parentId = null;

    if (section.category) {
      console.log(`\nCreating category: "${section.category}"...`);
      const cat = await apiRequest(`/guilds/${guildId}/channels`, 'POST', {
        name: section.category,
        type: 4
      });
      parentId = cat.id;
      await sleep(550);
    }

    for (const ch of section.channels) {
      console.log(`  Creating: "${ch.name}"...`);
      const payload = {
        name: ch.name,
        type: ch.type,
        parent_id: parentId
      };
      if (ch.readOnly) {
        payload.permission_overwrites = READ_ONLY_OVERWRITE;
      }

      const created = await apiRequest(`/guilds/${guildId}/channels`, 'POST', payload);
      console.log(`    Created: ${created.name}`);
      await sleep(550);
    }
  }

  console.log("\nAll channels recreated cleanly with invisible characters!");
}

main().catch(err => {
  console.error("Rebuild failed:", err);
  process.exit(1);
});
