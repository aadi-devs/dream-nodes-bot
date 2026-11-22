const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();

const targetMessages = [
  { chName: '♘・ᴀᴅᴠᴀɴᴄᴇ-ᴘʟᴀɴꜱ', chId: '1573281486822445128', msgId: '1573688254908207249' },
  { chName: '♘・ᴏꜰꜰᴇʀꜱ', chId: '1573281500290359338', msgId: '1574087340283138239' },
  { chName: '♘・ɪɴᴛᴇʟ-ᴠᴘꜱ-ᴘʟᴀɴꜱ', chId: '1573281509140336816', msgId: '1573741063175151717' },
  { chName: '♘・ᴀᴍᴅ-ᴇᴘʏᴄ-ᴠᴘꜱ', chId: '1573281514165248091', msgId: '1573742677328007210' },
  { chName: '♘・ꜱɪɴɢᴀᴘᴏʀᴇ-ɪɴᴛᴇʟ-ᴠᴘꜱ', chId: '1573281518787494048', msgId: '1573767120104202341' },
  { chName: '♘・ꜱɪɴɢᴀᴘᴏʀᴇ-ᴀᴍᴅ-ᴠᴘꜱ', chId: '1573281523380133910', msgId: '1573767507922133024' },
  { chName: '♘・ᴀᴜᴄᴛɪᴏɴꜱ', chId: '1573281528031481967', msgId: '1574087291578613771' },
  { chName: '⚜・ᴅᴏᴍᴀɪɴ-ᴘʟᴀɴꜱ', chId: '1573281547564359710', msgId: '1573746263441022988' },
  { chName: '⚜・ʙᴏᴛ-ʜᴏꜱᴛɪɴɢ', chId: '1573281551746207778', msgId: '1573747139039985847' },
  { chName: '⚜・ʀᴅᴘ-ᴘʟᴀɴꜱ', chId: '1573281556968112248', msgId: '1573766690842476596' },
  { chName: '⚜・ᴡᴇʙ-ʜᴏꜱᴛɪɴɢ', chId: '1573281561493766164', msgId: '1573766242203078758' },
  { chName: '⚜・ꜱᴛᴏʀᴀɢᴇ-ꜱᴇʀᴠᴇʀꜱ', chId: '1573281565763567676', msgId: '1573765844138197184' },
  { chName: '➤・ʙᴏᴏꜱᴛ-ᴘᴇʀᴋꜱ', chId: '1573281583388168297', msgId: '1573744973294084168' },
  { chName: '⊘・ᴄʀᴇᴀᴛᴇ-ᴛɪᴄᴋᴇᴛ', chId: '1573281601775870043', msgId: '1573773937383440486' },
  { chName: '♘・ʙᴜᴅɢᴇᴛ-ᴘʟᴀɴꜱ', chId: '1573712408554377336', msgId: '1573738387918299259' },
  { chName: '𖹭ᐟ・ᴄʜᴀɴɢᴇʟᴏɢꜱ', chId: '1573281468145336441', msgId: '1574093615750189131' }
];

async function updateAllMessages() {
  console.log(`Starting replacement of dreamnodes.host -> dreamnodes.cloud across ${targetMessages.length} messages...`);
  let successCount = 0;

  for (const item of targetMessages) {
    try {
      const getRes = await fetch(`https://discord.com/api/v10/channels/${item.chId}/messages/${item.msgId}`, {
        headers: { Authorization: `Bot ${token}` }
      });
      if (!getRes.ok) {
        console.error(`✗ Fetch failed for ${item.chName}:`, getRes.status);
        continue;
      }
      const msg = await getRes.json();

      let hasChanges = false;
      let patchBody = {
        flags: msg.flags || 32768
      };

      if (msg.components && msg.components.length > 0) {
        let rawJson = JSON.stringify(msg.components);
        if (rawJson.includes('dreamnodes.host') || rawJson.includes('dreamnodes.com')) {
          hasChanges = true;
          rawJson = rawJson.replace(/dreamnodes\.host/g, 'dreamnodes.cloud').replace(/dreamnodes\.com/g, 'dreamnodes.cloud');
          patchBody.components = JSON.parse(rawJson);
        } else {
          patchBody.components = msg.components;
        }
      }

      if (msg.content && typeof msg.content === 'string') {
        if (msg.content.includes('dreamnodes.host') || msg.content.includes('dreamnodes.com')) {
          hasChanges = true;
          patchBody.content = msg.content.replace(/dreamnodes\.host/g, 'dreamnodes.cloud').replace(/dreamnodes\.com/g, 'dreamnodes.cloud');
        }
      }

      if (!hasChanges) {
        console.log(`- Skipping ${item.chName} (no dreamnodes.host found)`);
        continue;
      }

      const patchRes = await fetch(`https://discord.com/api/v10/channels/${item.chId}/messages/${item.msgId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bot ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patchBody)
      });

      if (patchRes.ok) {
        console.log(`✓ Successfully updated ${item.chName} (${item.msgId})`);
        successCount++;
      } else {
        const err = await patchRes.text();
        console.error(`✗ Failed to update ${item.chName}:`, err);
      }

      await new Promise(r => setTimeout(r, 400));
    } catch (e) {
      console.error(`Error updating ${item.chName}:`, e.message);
    }
  }

  console.log(`\nReplacement complete! ${successCount} messages updated.`);
}

updateAllMessages();
