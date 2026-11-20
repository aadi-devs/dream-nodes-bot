const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const token = envContent.match(/DISCORD_TOKEN=(.*)/)[1].trim();
const guildId = '1573272872737181696';

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
      await sleep(retryAfter + 400);
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

const READ_ONLY = [
  {
    id: guildId,
    type: 0,
    deny: '2048' // Deny SEND_MESSAGES
  }
];

async function main() {
  console.log("Restoring deleted channels immediately...");

  // 1. Get current channels and categories to find IDs
  const channels = await apiRequest(`/guilds/${guildId}/channels`);
  const gatewayCat = channels.find(c => c.type === 4 && c.name.includes("GATEWAY"));
  const dreamNodesCat = channels.find(c => c.type === 4 && c.name.includes("DREAM NODES"));

  console.log("Found Gateway Cat ID:", gatewayCat?.id);
  console.log("Found Dream Nodes Cat ID:", dreamNodesCat?.id);

  const gatewayId = gatewayCat ? gatewayCat.id : '1573281437573062720';
  const dreamNodesId = dreamNodesCat ? dreamNodesCat.id : '1573281455109308426';

  // Channels to restore:
  // 1. Top-level (no category)
  // 2. Gateway
  // 3. Announcements under Dream Nodes

  const toCreate = [
    {
      name: 'ⓓ・ᴅʀᴇᴀᴍ-ɴᴏᴅᴇꜱ',
      type: 0,
      parent_id: null,
      position: 0,
      readOnly: true
    },
    {
      name: '♡・ꜱᴇʀᴠᴇʀ-ɪɴꜰᴏ',
      type: 0,
      parent_id: null,
      position: 1,
      readOnly: true
    },
    {
      name: '𖹭ᐟ・ᴡᴇʟᴄᴏᴍᴇ',
      type: 0,
      parent_id: gatewayId,
      position: 0,
      readOnly: true
    },
    {
      name: '𖹭ᐟ・ᴅᴏɴᴛ-ᴍꜱɢ-ʜᴇʀᴇ',
      type: 0,
      parent_id: gatewayId,
      position: 1,
      readOnly: true
    },
    {
      name: '𖹭ᐟ・ᴛᴇʀᴍꜱ-ᴀɴᴅ-ʀᴇꜰᴜɴᴅ-ᴘᴏʟɪᴄʏ',
      type: 0,
      parent_id: gatewayId,
      position: 2,
      readOnly: true
    },
    {
      name: '𖹭ᐟ・ᴀɴɴᴏᴜɴᴄᴇᴍᴇɴᴛꜱ',
      type: 0,
      parent_id: dreamNodesId,
      position: 0,
      readOnly: true
    }
  ];

  for (const item of toCreate) {
    console.log(`Recreating channel: ${item.name}...`);
    const payload = {
      name: item.name,
      type: item.type,
      parent_id: item.parent_id,
      permission_overwrites: item.readOnly ? READ_ONLY : []
    };
    if (item.position !== undefined) {
      payload.position = item.position;
    }

    try {
      const created = await apiRequest(`/guilds/${guildId}/channels`, 'POST', payload);
      console.log(`  ✓ Successfully created ${created.name} (ID: ${created.id})`);
    } catch (e) {
      console.error(`  ✗ Error creating ${item.name}:`, e.message);
    }
    await sleep(650);
  }

  console.log("\nAll channels successfully restored!");
}

main().catch(console.error);
