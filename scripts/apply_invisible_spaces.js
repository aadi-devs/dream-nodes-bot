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
const inv = '\u17b5'; // Invisible non-hyphenating spacing character

async function run() {
  console.log("Fetching channels...");
  const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
    headers: { Authorization: `Bot ${token}` }
  });
  const channels = await res.json();
  const textChannels = channels.filter(c => c.type === 0);

  console.log(`Found ${textChannels.length} text channels to update...`);

  for (const ch of textChannels) {
    let newName = ch.name;
    // Replace '-•-' with invisible spacing around bullet
    if (newName.includes('-•-')) {
      newName = newName.replace('-•-', `${inv}•${inv}`);
    } else if (newName.includes('•') && !newName.includes(`${inv}•${inv}`)) {
      newName = newName.replace('•', `${inv}•${inv}`);
    }

    if (newName !== ch.name) {
      console.log(`Renaming: "${ch.name}" -> "${newName}"`);
      while (true) {
        const patchRes = await fetch(`https://discord.com/api/v10/channels/${ch.id}`, {
          method: 'PATCH',
          headers: { Authorization: `Bot ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName })
        });
        if (patchRes.status === 429) {
          const rateData = await patchRes.json();
          const waitTime = (rateData.retry_after || 1) * 1000;
          console.log(`  [Rate Limit] Waiting ${waitTime}ms...`);
          await sleep(waitTime + 300);
          continue;
        }
        if (!patchRes.ok) {
          console.error(`  Failed to rename ${ch.name}:`, await patchRes.text());
        } else {
          console.log(`  ✓ Updated to: ${newName}`);
        }
        break;
      }
      await sleep(600);
    }
  }

  console.log("\nAll channels updated with invisible spacing!");
}

run().catch(console.error);
