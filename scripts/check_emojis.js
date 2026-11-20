const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const token = envContent.match(/DISCORD_TOKEN=(.*)/)[1].trim();
const guildId = '1573272872737181696';

async function main() {
  const guildRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}`, {
    headers: { Authorization: `Bot ${token}` }
  });
  const guild = await guildRes.json();
  console.log(`Guild: ${guild.name} (Premium Tier: ${guild.premium_tier}, Boosts: ${guild.premium_subscription_count})`);

  const emojisRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/emojis`, {
    headers: { Authorization: `Bot ${token}` }
  });
  const emojis = await emojisRes.json();
  console.log(`Current emojis in server: ${emojis.length}`);
  const animated = emojis.filter(e => e.animated);
  const static = emojis.filter(e => !e.animated);
  console.log(`  - Animated: ${animated.length}`);
  console.log(`  - Static: ${static.length}`);
}

main().catch(console.error);
