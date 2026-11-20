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
  console.log(`Total channels found: ${channels.length}`);
  for (const c of channels) {
    console.log(`ID: ${c.id} | Type: ${c.type} | Parent: ${c.parent_id} | Name: "${c.name}"`);
  }
}

main().catch(console.error);
