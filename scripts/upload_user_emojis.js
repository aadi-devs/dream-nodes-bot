const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();

const catalogFile = path.join(__dirname, 'clean_user_emojis_catalog.json');
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const botEmojisFile = path.join(dataDir, 'bot_emojis.json');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadUserEmojis() {
  console.log('--- Uploading Curated Discord Server Emojis to Bot Application ---');

  if (!fs.existsSync(catalogFile)) {
    console.error(`Catalog not found: ${catalogFile}`);
    return;
  }

  const catalog = JSON.parse(fs.readFileSync(catalogFile, 'utf8'));
  console.log(`Loaded ${catalog.length} curated server emojis.`);

  const animatedTotal = catalog.filter(e => e.isAnimated).length;
  const staticTotal = catalog.filter(e => !e.isAnimated).length;
  console.log(`Animated (Priority): ${animatedTotal} | Static: ${staticTotal}`);

  // Fetch App
  const meRes = await fetch('https://discord.com/api/v10/applications/@me', {
    headers: { Authorization: `Bot ${token}` }
  });
  const app = await meRes.json();
  const appId = app.id;
  console.log(`Target Application: "${app.name}" (${appId})`);

  // Fetch existing
  const existingRes = await fetch(`https://discord.com/api/v10/applications/${appId}/emojis`, {
    headers: { Authorization: `Bot ${token}` }
  });
  const existingJson = await existingRes.json();
  const existingItems = existingJson.items || [];
  console.log(`Existing Application Emojis on Bot: ${existingItems.length}`);

  const existingNameSet = new Set(existingItems.map(e => e.name.toLowerCase()));
  const uploadedResults = fs.existsSync(botEmojisFile) ? JSON.parse(fs.readFileSync(botEmojisFile, 'utf8')) : [];

  let successCount = uploadedResults.length;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < catalog.length; i++) {
    const item = catalog[i];
    const targetName = item.discordName;

    if (existingNameSet.has(targetName)) {
      skippedCount++;
      continue;
    }

    let success = false;
    let attempts = 0;

    while (!success && attempts < 5) {
      attempts++;
      try {
        const fileBuffer = fs.readFileSync(item.filePath);
        const mimeType = item.isAnimated ? 'image/gif' : (item.ext === '.png' ? 'image/png' : 'image/webp');
        const b64 = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

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
          successCount++;
          existingNameSet.add(targetName);

          const formattedTag = resData.animated
            ? `<a:${resData.name}:${resData.id}>`
            : `<:${resData.name}:${resData.id}>`;

          uploadedResults.push({
            id: resData.id,
            name: resData.name,
            animated: resData.animated,
            formatted: formattedTag,
            originalFile: item.originalName
          });

          if (successCount % 10 === 0 || i === catalog.length - 1) {
            fs.writeFileSync(botEmojisFile, JSON.stringify(uploadedResults, null, 2), 'utf8');
          }

          console.log(`[${successCount}/${catalog.length}] ✓ Uploaded ${formattedTag} (${item.originalName})`);
          success = true;

          // Rate limit courtesy delay
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
  console.log(`Total Uploaded: ${successCount}`);
  console.log(`Skipped (already exists): ${skippedCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Catalog saved to: ${botEmojisFile}`);
  console.log('======================================================');
}

uploadUserEmojis().catch(console.error);
