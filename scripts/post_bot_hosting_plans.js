const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281551746207778'; // # ⚜・ʙᴏᴛ-ʜᴏꜱᴛɪɴɢ
const messageId = '1573747139039985847';
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.cloud';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# ${E.bots} DREAM NODES ┃ Discord Bot Hosting
## ${E.lightning} 24/7 Always-Online Cloud Bot Hosting • Node.js, Python, Java & Bun

> ${E.sparkles} **High-Reliability Discord Bot Hosting:** Run your Discord bots, automation scripts, webhook handlers, and API microservices on enterprise NVMe nodes with guaranteed 99.9% uptime, auto-restart, and continuous DDoS defense.`;

const sectionSmall =
`### ${E.fireBlue} Starter Bot Hosting (Small Fleets)

> ${E.arrowOrange} **BASIC** ── ${E.cash} **\`₹44 /mo\`**
> ${E.cpu} \`0.5 Core\` ┃ ${E.ram} \`500 MB DDR4\` ┃ ${E.disk} \`1 GB NVMe\` ┃ ${E.chest} \`2 Databases\`
> 
> ${E.arrowOrange} **STARTER** ── ${E.cash} **\`₹74 /mo\`**
> ${E.cpu} \`1.0 Core\` ┃ ${E.ram} \`1 GB DDR4\` ┃ ${E.disk} \`2 GB NVMe\` ┃ ${E.chest} \`2 Databases\``;

const sectionMedium =
`### ${E.lightning} Advanced Bot Hosting (Medium Fleets)

> ${E.lightning} **CODER** ── ${E.cash} **\`₹124 /mo\`**
> ${E.cpu} \`1.5 Cores\` ┃ ${E.ram} \`2 GB DDR4\` ┃ ${E.disk} \`5 GB NVMe\` ┃ ${E.chest} \`4 Databases\`
> 
> ${E.lightning} **BUILDER** ── ${E.cash} **\`₹154 /mo\`**
> ${E.cpu} \`2.0 Cores\` ┃ ${E.ram} \`3 GB DDR4\` ┃ ${E.disk} \`15 GB NVMe\` ┃ ${E.chest} \`6 Databases\``;

const sectionBig =
`### ${E.crownRed} Enterprise Heavyweight (Multi-Bot Fleets)

> ${E.crownRed} **DEVELOPER** ── ${E.cash} **\`₹189 /mo\`**
> ${E.cpu} \`3.0 Cores\` ┃ ${E.ram} \`5 GB DDR4\` ┃ ${E.disk} \`25 GB NVMe\` ┃ ${E.chest} \`10 Databases\`
> 
> ${E.crownRed} **ARCHITECT** ── ${E.cash} **\`₹249 /mo\`**
> ${E.cpu} \`6.0 Cores\` ┃ ${E.ram} \`10 GB DDR4\` ┃ ${E.disk} \`50 GB NVMe\` ┃ ${E.chest} \`15 Databases\``;

const sectionFeatures =
`### ${E.settings} Included With Every Bot Plan:
> ${E.rocket} **Instant Setup:** Environment is live within seconds of ticket confirmation.
> ${E.gear} **Multi-Runtime Support:** Native Node.js (v18/v20/v22), Python (3.10-3.12), Bun, Java & Go.
> ${E.timer} **24/7 Guaranteed Uptime:** Always-on container infrastructure with 99.9% SLA.
> ${E.chest} **Dedicated MySQL Databases:** Free managed database storage included with every plan.
> ${E.shield} **Enterprise DDoS Mitigation:** Continuous real-time traffic scrubbing for high reliability.
> ${E.security} **Free SSL Certificates:** Automatic TLS/SSL support for your bot webhooks and dashboards.
> ${E.controller} **Intuitive Panel Control:** Pterodactyl-powered control panel with file manager, logs & backups.`;

const v2Payload = {
  flags: 32768, // IS_COMPONENTS_V2
  components: [
    {
      type: 17, // Borderless Container
      components: [
        {
          type: 10,
          content: sectionHeader
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionSmall
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionMedium
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionBig
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionFeatures
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
              label: 'Order Bot Hosting / Open Ticket',
              url: ticketChannelUrl,
              emoji: B.ticket
            },
            {
              type: 2,
              style: 5,
              label: 'Official Website',
              url: websiteUrl,
              emoji: B.world
            },
            {
              type: 2,
              style: 5,
              label: 'How To Buy',
              url: howToBuyUrl,
              emoji: B.info
            }
          ]
        },
        {
          type: 10,
          content: `-# ${E.verifiedBlue} Dream Nodes • Enterprise High-Speed Discord Bot & Microservice Hosting`
        }
      ]
    }
  ]
};

async function updateBotHostingPlans() {
  console.log('Patching Bot Hosting Plans embed in channel', channelId);
  const patchRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(v2Payload)
  });
  const patchData = await patchRes.json();
  if (patchData.id) {
    console.log('✓ Successfully updated Bot Hosting Plans embed! Message ID:', patchData.id);
  } else {
    console.error('✗ Failed to patch Bot Hosting Plans:', JSON.stringify(patchData, null, 2));
  }
}

if (require.main === module) {
  updateBotHostingPlans();
}

module.exports = { updateBotHostingPlans, v2Payload };
