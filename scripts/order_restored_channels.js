const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const token = envContent.match(/DISCORD_TOKEN=(.*)/)[1].trim();
const guildId = '1573272872737181696';

async function main() {
  const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
    headers: { Authorization: `Bot ${token}` }
  });
  const channels = await res.json();

  const dreamNodesTop = channels.find(c => c.name.includes('ᴅʀᴇᴀᴍ-ɴᴏᴅᴇꜱ') && c.parent_id === null);
  const serverInfoTop = channels.find(c => c.name.includes('ꜱᴇʀᴠᴇʀ-ɪɴꜰᴏ') && c.parent_id === null);
  
  const welcomeCh = channels.find(c => c.name.includes('ᴡᴇʟᴄᴏᴍᴇ'));
  const dontMsgCh = channels.find(c => c.name.includes('ᴅᴏɴᴛ-ᴍꜱɢ-ʜᴇʀᴇ'));
  const termsCh = channels.find(c => c.name.includes('ᴛᴇʀᴍꜱ-ᴀɴᴅ-ʀᴇꜰᴜɴᴅ-ᴘᴏʟɪᴄʏ'));

  const annCh = channels.find(c => c.name.includes('ᴀɴɴᴏᴜɴᴄᴇᴍᴇɴᴛꜱ'));
  const updCh = channels.find(c => c.name.includes('ᴜᴘᴅᴀᴛᴇꜱ'));
  const clCh = channels.find(c => c.name.includes('ᴄʜᴀɴɢᴇʟᴏɢꜱ'));
  const infraCh = channels.find(c => c.name.includes('ɪɴꜰʀᴀꜱᴛʀᴜᴄᴛᴜʀᴇ'));
  const ytCh = channels.find(c => c.name.includes('ʏᴏᴜᴛᴜʙᴇ-ᴄʀᴇᴀᴛᴏʀꜱ'));

  const positions = [
    { id: dreamNodesTop.id, position: 0 },
    { id: serverInfoTop.id, position: 1 },
    { id: welcomeCh.id, position: 0 },
    { id: dontMsgCh.id, position: 1 },
    { id: termsCh.id, position: 2 },
    { id: annCh.id, position: 0 },
    { id: updCh.id, position: 1 },
    { id: clCh.id, position: 2 },
    { id: infraCh.id, position: 3 },
    { id: ytCh.id, position: 4 },
  ];

  console.log("Ordering channels...");
  const patchRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(positions)
  });

  if (patchRes.ok || patchRes.status === 204) {
    console.log("✓ Channel positions and order successfully updated!");
  } else {
    console.log("Patch response:", patchRes.status, await patchRes.text());
  }
}

main().catch(console.error);
