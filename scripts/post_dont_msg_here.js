const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573337296042729502'; // # 𖹭ᐟ・ᴅᴏɴᴛ-ᴍꜱɢ-ʜᴇʀᴇ
const messageId = '1573402481214492685';

const content = 
`### ${E.stopSign} ${E.siren} ᴅᴏ ɴᴏᴛ ꜱᴇɴᴅ ᴍᴇꜱꜱᴀɢᴇꜱ ʜᴇʀᴇ !
${E.alert} ᴛʜɪꜱ ᴄʜᴀɴɴᴇʟ ɪꜱ ᴜꜱᴇᴅ ᴛᴏ ᴄᴀᴛᴄʜ ꜱᴘᴀᴍ ʙᴏᴛꜱ & ʀᴀɪᴅᴇʀꜱ .
${E.arrowBlue} ${E.cross} ᴀɴʏ ᴍᴇꜱꜱᴀɢᴇꜱ ꜱᴇɴᴛ ʜᴇʀᴇ ᴡɪʟʟ ʀᴇꜱᴜʟᴛ ɪɴ ᴀɴ ɪᴍᴍᴇᴅɪᴀᴛᴇ **ꜱᴏꜰᴛʙᴀɴ** !
${E.arrowBlue} ${E.chat} ɪꜰ ʏᴏᴜ ᴀʀᴇ ᴀ ʜᴜᴍᴀɴ , ᴘʟᴇᴀꜱᴇ ᴄʜᴀᴛ ɪɴ <#1573281610210611266> !`;

const payload = {
  flags: 32768,
  components: [
    {
      type: 17,
      components: [
        {
          type: 9, // Section with accessory
          components: [
            {
              type: 10,
              content: content
            }
          ],
          accessory: {
            type: 11,
            media: {
              url: 'https://cdn.discordapp.com/attachments/1573337296042729502/1573402481159970957/honeypot_3d.png?ex=6b03daff&is=6b02897f&hm=e15a0b443489b931c05217056487e86ddb1e22d061ee8975b16237ec7bd3b6fe&'
            }
          }
        },
        {
          type: 1,
          components: [
            {
              type: 2,
              custom_id: 'honeypot_kicks_display',
              style: 2,
              label: 'ᴋɪᴄᴋꜱ: 0',
              emoji: B.alert
            }
          ]
        }
      ]
    }
  ]
};

async function updateDontMsgHere() {
  console.log('Patching Dont Msg Here honeypot embed in channel', channelId);
  const patchRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const patchData = await patchRes.json();
  if (patchData.id) {
    console.log('✓ Successfully updated Dont Msg Here embed! Message ID:', patchData.id);
  } else {
    console.error('✗ Failed to patch Dont Msg Here:', JSON.stringify(patchData, null, 2));
  }
}

if (require.main === module) {
  updateDontMsgHere();
}

module.exports = { updateDontMsgHere, payload };
