const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281551746207778'; // # ⚜・ʙᴏᴛ-ʜᴏꜱᴛɪɴɢ
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.com';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# <a:bots:1573382261318099094> 𝐃𝐑𝐄𝐀𝐌 𝐍𝐎𝐃𝐄𝐒 ┃ Discord Bot Hosting
## <a:Lightning:1573382171257737317> ⚡ 24/7 Always-Online Cloud Bot Hosting • Node.js, Python, Java & Bun

> <a:sparkles_sparkles:1573382447603785928> **High-Reliability Discord Bot Hosting:** Run your Discord bots, automation scripts, webhook handlers, and API microservices on enterprise NVMe nodes with guaranteed 99.9% uptime, auto-restart, and continuous DDoS defense.`;

const sectionSmall =
`### <a:b_fire:1573381944702533732> Starter Bot Hosting (Small Fleets)

> 🤖 **BASIC** ── <a:cash:1573382269735805008> **\`₹44 /mo\`**
> <:cpu:1573382485310709781> \`0.5 Core\` ┃ <:RAM:1573382492973568062> \`500 MB DDR4\` ┃ <:disk:1573382500795818114> \`1 GB NVMe\` ┃ 🗄️ \`2 Databases\`
> 
> 🤖 **STARTER** ── <a:cash:1573382269735805008> **\`₹74 /mo\`**
> <:cpu:1573382485310709781> \`1.0 Core\` ┃ <:RAM:1573382492973568062> \`1 GB DDR4\` ┃ <:disk:1573382500795818114> \`2 GB NVMe\` ┃ 🗄️ \`2 Databases\``;

const sectionMedium =
`### <a:Lightning:1573382171257737317> Advanced Bot Hosting (Medium Fleets)

> ⚡ **CODER** ── <a:cash:1573382269735805008> **\`₹124 /mo\`**
> <:cpu:1573382485310709781> \`1.5 Cores\` ┃ <:RAM:1573382492973568062> \`2 GB DDR4\` ┃ <:disk:1573382500795818114> \`5 GB NVMe\` ┃ 🗄️ \`4 Databases\`
> 
> ⚡ **BUILDER** ── <a:cash:1573382269735805008> **\`₹154 /mo\`**
> <:cpu:1573382485310709781> \`2.0 Cores\` ┃ <:RAM:1573382492973568062> \`3 GB DDR4\` ┃ <:disk:1573382500795818114> \`15 GB NVMe\` ┃ 🗄️ \`6 Databases\``;

const sectionBig =
`### <a:RedCrown:1573382179298353186> Enterprise Heavyweight (Multi-Bot Fleets)

> 👑 **DEVELOPER** ── <a:cash:1573382269735805008> **\`₹189 /mo\`**
> <:cpu:1573382485310709781> \`3.0 Cores\` ┃ <:RAM:1573382492973568062> \`5 GB DDR4\` ┃ <:disk:1573382500795818114> \`25 GB NVMe\` ┃ 🗄️ \`10 Databases\`
> 
> 👑 **ARCHITECT** ── <a:cash:1573382269735805008> **\`₹249 /mo\`**
> <:cpu:1573382485310709781> \`6.0 Cores\` ┃ <:RAM:1573382492973568062> \`10 GB DDR4\` ┃ <:disk:1573382500795818114> \`50 GB NVMe\` ┃ 🗄️ \`15 Databases\``;

const sectionFeatures =
`### <a:settings:1573382421611806763> Included With Every Bot Plan:
> 🚀 **Instant Setup:** Environment is live within seconds of ticket confirmation.
> 💻 **Multi-Runtime Support:** Native Node.js (v18/v20/v22), Python (3.10-3.12), Bun, Java & Go.
> 🕒 **24/7 Guaranteed Uptime:** Always-on container infrastructure with 99.9% SLA.
> 🗄️ **Dedicated MySQL Databases:** Free managed database storage included with every plan.
> 🛡️ **Enterprise DDoS Mitigation:** Continuous real-time traffic scrubbing for high reliability.
> 🔒 **Free SSL Certificates:** Automatic TLS/SSL support for your bot webhooks and dashboards.
> 📊 **Intuitive Panel Control:** Pterodactyl-powered control panel with file manager, logs & backups.`;

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
              emoji: { name: '🤖' }
            },
            {
              type: 2,
              style: 5,
              label: 'Official Website',
              url: websiteUrl,
              emoji: { name: '🌐' }
            },
            {
              type: 2,
              style: 5,
              label: 'How To Buy',
              url: howToBuyUrl,
              emoji: { name: '📖' }
            }
          ]
        },
        {
          type: 10,
          content: '-# 🤖 Dream Nodes • Enterprise High-Speed Discord Bot & Microservice Hosting'
        }
      ]
    }
  ]
};

async function postBotHostingPlans() {
  console.log('Posting Bot Hosting Plans V2 Container to channel', channelId);
  const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(v2Payload)
  });

  const data = await res.json();
  if (data.id) {
    console.log('✓ Successfully posted Bot Hosting Plans embed! Message ID:', data.id);
    
    // Add reactions
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${data.id}/reactions/%F0%9F%A4%96/@me`, { // 🤖
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${data.id}/reactions/%E2%9A%A1/@me`, { // ⚡
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
  } else {
    console.error('✗ Failed to post:', JSON.stringify(data, null, 2));
  }
}

postBotHostingPlans();
