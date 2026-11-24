const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { E, B } = require('../src/emojis');

const targetChannelId = '1573337308529434756'; // 𖹭ᐟ・ᴀɴɴᴏᴜɴᴄᴇᴍᴇɴᴛꜱ
const messageId = '1574681392049291338';
const clientRoleId = '1573412778620747886'; // ⋆｡°✩ ƈʅιҽɳƚ ✩°｡⋆
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const panelUrl = 'https://panel.dreamnodes.cloud';

const announcementMarkdown =
`# ${E.alert} **DATACENTER SERVICE NOTICE** ${E.siren}

> ${E.gearsLoading} **Attention:** <@&${clientRoleId}>
> ${E.arrowBlue} **Status:** ${E.alert2} **Temporary Datacenter Downtime**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ${E.alert} **Temporary Service Downtime**
We have encountered a **temporary downtime directly from our upstream datacenter**.

> ${E.settings} **Resolution:** Datacenter engineers are actively resolving the issue to restore full connectivity.
> ${E.clock} **Updates:** **You will be notified here immediately the moment we are back up.**
> ${E.verifiedBlue} **Data Safety:** All server data, worlds, and configurations are 100% safe and unaffected.

**Please stay patient while the datacenter completes the restoration.** We are closely monitoring the situation and will ping you as soon as services are live!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${E.ticket} Need urgent assistance? Open a ticket in <#1573281601775870043>.`;

const payload = {
  flags: 32768, // IS_COMPONENTS_V2
  allowed_mentions: { roles: [clientRoleId] },
  components: [
    {
      type: 17, // Borderless Container with Accent Bar
      accent_color: 15548997, // High-visibility Discord Red (#ED4245)
      components: [
        {
          type: 10,
          content: announcementMarkdown
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 1, // Action Row
          components: [
            {
              type: 2,
              style: 5,
              label: 'Control Panel',
              emoji: B.server,
              url: panelUrl
            },
            {
              type: 2,
              style: 5,
              label: 'Support Tickets',
              emoji: B.ticket,
              url: ticketChannelUrl
            }
          ]
        },
        {
          type: 10,
          content: `-# ${E.verifiedBlue} Dream Nodes • Official Network & Infrastructure Notice`
        }
      ]
    }
  ]
};

async function main() {
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    console.error('Missing DISCORD_TOKEN');
    process.exit(1);
  }

  console.log('Updating message', messageId, 'in channel', targetChannelId);
  const res = await fetch(`https://discord.com/api/v10/channels/${targetChannelId}/messages/${messageId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (res.ok) {
    console.log('SUCCESS! Updated announcement message ID:', data.id);
    console.log('Mention roles:', data.mention_roles);
  } else {
    console.error('ERROR updating announcement:', res.status, data);
  }
}

main().catch(console.error);
