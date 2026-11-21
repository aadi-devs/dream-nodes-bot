const fs = require('fs');
const path = require('path');
const { buildTicketPanelPayload } = require('../src/tickets');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281601775870043'; // # ⊘・ᴄʀᴇᴀᴛᴇ-ᴛɪᴄᴋᴇᴛ

async function postTicketPanel() {
  console.log('Posting Support Ticket Panel V2 Container to channel', channelId);
  const payload = buildTicketPanelPayload();

  // Check if messages already exist in channel
  const getRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages?limit=5`, {
    headers: { Authorization: `Bot ${token}` }
  });
  const msgs = await getRes.json();
  if (Array.isArray(msgs) && msgs.length > 0) {
    console.log('Existing message found, updating in place:', msgs[0].id);
    const patchRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${msgs[0].id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const patchData = await patchRes.json();
    if (patchData.id) {
      console.log('✓ Successfully updated existing Ticket Panel! Message ID:', patchData.id);
      return;
    }
  }

  const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (data.id) {
    console.log('✓ Successfully posted Ticket Panel! Message ID:', data.id);
    
    // Add reaction
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${data.id}/reactions/%F0%9F%8E%AB/@me`, { // 🎫
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
  } else {
    console.error('✗ Failed to post ticket panel:', JSON.stringify(data, null, 2));
  }
}

postTicketPanel();
