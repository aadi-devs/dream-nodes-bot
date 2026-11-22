const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();

const preparedFile = path.join(__dirname, 'emojis_1000_prepared.json');
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const botEmojisFile = path.join(dataDir, 'bot_emojis.json');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadAll() {
  console.log('--- Dream Nodes 1,000 Animated Application Emojis Uploader ---');

  if (!fs.existsSync(preparedFile)) {
    console.error(`Prepared file not found: ${preparedFile}`);
    return;
  }

  const emotes = JSON.parse(fs.readFileSync(preparedFile, 'utf8'));
  console.log(`Loaded ${emotes.length} curated animated emotes from disk.`);

  // 1. Fetch Application ID & Existing Emojis
  const meRes = await fetch('https://discord.com/api/v10/applications/@me', {
    headers: { Authorization: `Bot ${token}` }
  });
  if (!meRes.ok) {
    console.error('Failed to get bot application info:', await meRes.text());
    return;
  }
  const app = await meRes.json();
  const appId = app.id;
  console.log(`Application: "${app.name}" (ID: ${appId})`);

  const existingRes = await fetch(`https://discord.com/api/v10/applications/${appId}/emojis`, {
    headers: { Authorization: `Bot ${token}` }
  });
  const existingJson = await existingRes.json();
  const existingItems = existingJson.items || [];
  console.log(`Currently installed Application Emojis on bot: ${existingItems.length}`);

  const existingNameSet = new Set(existingItems.map(e => e.name.toLowerCase()));
  const uploadedResults = fs.existsSync(botEmojisFile) ? JSON.parse(fs.readFileSync(botEmojisFile, 'utf8')) : [];

  let uploadedCount = uploadedResults.length;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < emotes.length; i++) {
    const item = emotes[i];
    const targetName = item.discordName;

    // Check if already uploaded
    if (existingNameSet.has(targetName)) {
      skippedCount++;
      continue;
    }

    let success = false;
    let attempts = 0;

    while (!success && attempts < 4) {
      attempts++;
      try {
        // Download GIF
        const gifRes = await fetch(item.gifUrl);
        if (!gifRes.ok) {
          console.warn(`[Skip] Could not download GIF for ${item.discordName} (${gifRes.status})`);
          break;
        }

        const buf = Buffer.from(await gifRes.arrayBuffer());
        if (buf.length > 256 * 1024) {
          console.warn(`[Skip] GIF exceeds 256KB for ${item.discordName} (${buf.length} bytes)`);
          break;
        }

        const b64 = `data:image/gif;base64,${buf.toString('base64')}`;

        // Upload to Discord Application Emojis
        const uploadRes = await fetch(`https://discord.com/api/v10/applications/${appId}/emojis`, {
          method: 'POST',
          headers: {
            Authorization: `Bot ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: targetName,
            image: b64
          })
        });

        if (uploadRes.status === 201) {
          const resData = await uploadRes.json();
          uploadedCount++;
          existingNameSet.add(targetName);

          const record = {
            id: resData.id,
            name: resData.name,
            animated: resData.animated,
            formatted: `<a:${resData.name}:${resData.id}>`,
            category: item.category,
            originalName: item.originalName
          };
          uploadedResults.push(record);

          if (uploadedCount % 10 === 0 || uploadedCount === emotes.length) {
            fs.writeFileSync(botEmojisFile, JSON.stringify(uploadedResults, null, 2), 'utf8');
          }

          console.log(`[${uploadedCount}/1000] ✓ Uploaded <a:${resData.name}:${resData.id}> | ${item.category}`);
          success = true;

          // Short courtesy pause
          await sleep(150);
        } else if (uploadRes.status === 429) {
          const errData = await uploadRes.json().catch(() => ({}));
          const retryAfter = errData.retry_after || parseFloat(uploadRes.headers.get('retry-after')) || 1.5;
          const waitMs = Math.ceil(retryAfter * 1000) + 300;
          console.log(`[Rate Limit] 429 encountered. Pausing for ${waitMs}ms...`);
          await sleep(waitMs);
        } else {
          const errText = await uploadRes.text();
          console.error(`[Error] Failed to upload ${targetName}: ${uploadRes.status} - ${errText}`);
          errorCount++;
          break;
        }
      } catch (err) {
        console.error(`[Exception] Upload error on ${targetName}:`, err.message);
        await sleep(1000);
      }
    }
  }

  fs.writeFileSync(botEmojisFile, JSON.stringify(uploadedResults, null, 2), 'utf8');

  console.log('\n======================================================');
  console.log(`Upload process finished!`);
  console.log(`Successfully Uploaded: ${uploadedCount}`);
  console.log(`Skipped (already exist): ${skippedCount}`);
  console.log(`Errors / Skipped: ${errorCount}`);
  console.log(`Results saved to: ${botEmojisFile}`);
  console.log('======================================================');
}

uploadAll().catch(console.error);
