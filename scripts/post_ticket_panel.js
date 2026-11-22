const fs = require('fs');
const path = require('path');
const { buildTicketPanelPayload } = require('../src/tickets');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281601775870043'; // # ⊘・ᴄʀᴇᴀᴛᴇ-ᴛɪᴄᴋᴇᴛ
const messageId = '1573773937383440486';

async function updateTicketPanel() {
  console.log('Patching Support Ticket Panel V2 Container to channel', channelId);
  const payload = buildTicketPanelPayload();
  const bannerPath = path.join(__dirname, '..', 'assets', 'ticket_banner.jpg');
  if (!fs.existsSync(bannerPath)) {
    throw new Error(`Banner not found: ${bannerPath}`);
  }
  const bannerBuf = fs.readFileSync(bannerPath);

  const formData = new FormData();
  formData.append('files[0]', new File([bannerBuf], 'ticket_banner.jpg', { type: 'image/jpeg' }));
  formData.append('payload_json', JSON.stringify(payload));

  const patchRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${token}`
    },
    body: formData
  });

  const patchData = await patchRes.json();
  if (patchData.id) {
    console.log('✓ Successfully updated existing Ticket Panel with Custom Banner! Message ID:', patchData.id);
  } else {
    console.error('✗ Failed to patch ticket panel:', JSON.stringify(patchData, null, 2));
  }
}

if (require.main === module) {
  updateTicketPanel();
}

module.exports = { updateTicketPanel };
