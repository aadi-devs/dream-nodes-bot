const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { E, B } = require('../src/emojis');

const targetChannelId = '1573337308529434756'; // 𖹭ᐟ・ᴀɴɴᴏᴜɴᴄᴇᴍᴇɴᴛꜱ
const messageId = '1574681392049291338';
const clientRoleId = '1573412778620747886'; // ⋆｡°✩ ƈʅιҽɳƚ ✩°｡⋆
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const panelUrl = 'https://panel.dreamnodes.cloud';

// Pure Components V2 payload (type: 17 borderless container, accent_color: null)
const payload = {
  flags: 32768, // IS_COMPONENTS_V2
  allowed_mentions: { roles: [clientRoleId] },
  components: [
    {
      type: 17, // Borderless Container V2
      accent_color: null,
      components: [
        {
          type: 10, // Text Display Header
          content: `# ${E.alert} **DATACENTER SERVICE NOTICE** ${E.siren}\n\n` +
                   `> ${E.gearsLoading} **Attention:** <@&${clientRoleId}>\n` +
                   `> ${E.arrowBlue} **Status:** ${E.alert2} **Temporary Datacenter Downtime**`
        },
        {
          type: 14, // Divider
          divider: true,
          spacing: 1
        },
        {
          type: 10, // Main Highlighted Body
          content: `## ${E.alert} **Temporary Service Downtime**\n\n` +
                   `We have encountered a **temporary downtime directly from our upstream datacenter**.\n\n` +
                   `> ${E.settings} **Resolution:** Datacenter engineers are actively resolving the issue to restore full connectivity.\n` +
                   `> ${E.clock} **Updates:** **You will be notified here immediately the moment we are back up.**\n` +
                   `> ${E.verifiedBlue} **Data Safety:** All server data, worlds, and configurations are 100% safe and unaffected.\n\n` +
                   `**Please stay patient while the datacenter completes the restoration.** We are closely tracking this and will ping you as soon as services are live!`
        },
        {
          type: 14, // Divider
          divider: true,
          spacing: 1
        },
        {
          type: 10, // Support link
          content: `${E.ticket} Need urgent assistance? Open a ticket in <#1573281601775870043>.`
        },
        {
          type: 14, // Divider
          divider: true,
          spacing: 1
        },
        {
          type: 1, // Action Row Buttons
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
          type: 10, // Footer Subtext
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

  console.log('Patching announcement message to pure Components V2 in channel:', targetChannelId);
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
    console.log('SUCCESS! Updated announcement to pure Components V2 message ID:', data.id);
    console.log('Flags:', data.flags, 'Accent color:', data.components[0]?.accent_color);
  } else {
    console.error('ERROR patching announcement:', res.status, data);
  }
}

main().catch(console.error);
