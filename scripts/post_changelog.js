const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();

// Target channel: # 𖹭ᐟ・ᴄʜᴀɴɢᴇʟᴏɢꜱ (1573281468145336441)
const changelogChannelId = '1573281468145336441';
const messageId = '1574093615750189131';
const clientRoleId = '1573412778620747886'; // ⋆｡°✩ ƈʅιҽɳƚ ✩°｡⋆
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';
const websiteUrl = 'https://dreamnodes.cloud';
const panelUrl = 'https://panel.dreamnodes.cloud';

// 100% Custom & Animated Emojis only — Zero standard/normal Unicode emojis
const changelogMarkdown = 
`# ${E.updates} **DREAM NODES ┃ SYSTEM CHANGELOG** ${E.sparkles}

> ${E.announce} **Control Panel & System Infrastructure Update**
> ${E.arrowBlue} ${E.lightning} **Version 1.2.0 • Feature & Proxy Release**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### ${E.settings} **What's New in this Release:**

> ${E.arrowBlue} ${E.hostinger} **Panel Theme Updated (Nebula)**
> The server management dashboard has been upgraded to the high-performance **Nebula Theme**, offering an ultra-clean modern UI, improved mobile responsiveness, and dark-mode optimization.
> 
> ${E.arrowBlue} ${E.membership} **Client Account Registration Added**
> Direct user self-registration is now fully operational on the panel! New clients can immediately create accounts and manage servers with zero onboarding delay.
> 
> ${E.arrowBlue} ${E.rocket} **Velocity Proxy Egg & Java 25 Support Added**
> Official **Velocity Proxy** egg has been introduced into our Minecraft node catalog, pre-configured and updated with support for modern Java runtimes (including Java 25 & 21 LTS) for optimal network routing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${E.tick5} Next-Gen NVMe Arrays • Instant Node Synchronization • Automated DDoS Mitigation
${E.tick5} Active 24/7 Client Care • 99.9% Infrastructure Uptime SLA

${E.chat} **Have questions or need assistance?** Open a ticket in <#1573281601775870043> ||<@&${clientRoleId}>||
${ticketChannelUrl}`;

const v2Payload = {
  flags: 32768, // IS_COMPONENTS_V2
  components: [
    {
      type: 17, // Borderless Container
      components: [
        {
          type: 10,
          content: changelogMarkdown
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 1, // Action Row with Buttons (100% custom emojis)
          components: [
            {
              type: 2,
              style: 5,
              label: 'Client Panel',
              url: panelUrl,
              emoji: B.vps
            },
            {
              type: 2,
              style: 5,
              label: 'Open a Ticket',
              url: ticketChannelUrl,
              emoji: B.chat
            },
            {
              type: 2,
              style: 5,
              label: 'How To Buy',
              url: howToBuyUrl,
              emoji: B.info
            },
            {
              type: 2,
              style: 5,
              label: 'Official Website',
              url: websiteUrl,
              emoji: B.world
            }
          ]
        },
        {
          type: 10,
          content: `-# ${E.starRotating} Dream Nodes • High-Performance Cloud Hosting & 24/7 Client Care Desk`
        }
      ]
    }
  ]
};

async function editChangelog() {
  console.log('Editing Changelog embed via Discord API (channelId:', changelogChannelId, ', messageId:', messageId, ')...');
  const patchRes = await fetch(`https://discord.com/api/v10/channels/${changelogChannelId}/messages/${messageId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(v2Payload)
  });

  const patchData = await patchRes.json();
  if (patchData.id) {
    console.log('✓ Successfully updated existing Changelog message! ID:', patchData.id);
  } else {
    console.error('✗ Failed to update changelog:', JSON.stringify(patchData, null, 2));
  }
}

if (require.main === module) {
  editChangelog();
}

module.exports = { editChangelog, v2Payload };
