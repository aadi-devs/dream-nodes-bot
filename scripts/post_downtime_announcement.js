const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { E, B } = require('../src/emojis');

const targetChannelId = '1573337308529434756'; // 𖹭ᐟ・ᴀɴɴᴏᴜɴᴄᴇᴍᴇɴᴛꜱ
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const panelUrl = 'https://panel.dreamnodes.cloud';

const announcementMarkdown =
`# ${E.alert} **TEMPORARY SERVICE DOWNTIME** ${E.siren}

> ${E.gearsLoading} **Dream Nodes Infrastructure Notice**
> ${E.arrowBlue} **Status:** ${E.alert2} **Upstream Datacenter Outage**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ${E.alert} **Datacenter Downtime Notice**
We are currently experiencing brief, temporary downtime due to an issue from our **upstream datacenter**.

> ${E.settings} **Status:** The datacenter engineers are actively working to restore connectivity.
> ${E.clock} **Updates:** You will be notified here immediately the moment everything is fully back up.
> ${E.verifiedBlue} **Data Safety:** All server data, configurations, and files are completely safe and untouched.

Please stay patient while the datacenter completes the restoration. Thank you for your understanding!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${E.ticket} For any urgent queries, feel free to visit <#1573281601775870043>.
||@everyone||`;

const payload = {
  flags: 32768, // IS_COMPONENTS_V2
  content: '',
  embeds: [],
  allowed_mentions: { parse: ['everyone', 'roles'] },
  components: [
    {
      type: 17, // Borderless Container
      accent_color: null,
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
          content: `-# ${E.verifiedBlue} Dream Nodes • Official Network & Infrastructure Announcement`
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

  console.log('Posting downtime announcement to channel:', targetChannelId);
  const res = await fetch(`https://discord.com/api/v10/channels/${targetChannelId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (res.ok) {
    console.log('SUCCESS! Sent downtime announcement message ID:', data.id);
  } else {
    console.error('ERROR posting announcement:', res.status, data);
  }
}

main().catch(console.error);
