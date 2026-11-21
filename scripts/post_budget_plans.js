const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281486822445128'; // # ♘・ʙᴜᴅɢᴇᴛ-ᴘʟᴀɴꜱ
const messageId = '1573688254908207249';
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.com';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# <a:minecraft:1573382379215659081> Dream Nodes | Budget Minecraft Hosting
## <a:Attacks:1573382140006244363> 🛡️ Enterprise Anti-DDoS Protected Nodes

> <a:siren:1573382431065509981> **ENTERPRISE GAME DDOS DEFENSE INCLUDED ON ALL PLANS**
> <a:Lightning:1573382171257737317> Every single node is fortified with dedicated **Layer 4 & Layer 7 Game Filters** built specifically for Minecraft. Our automated edge scrubbing stops UDP/TCP floods, SYN storms, null-ping exploits, and bot raids with **sub-second mitigation**—keeping your TPS stable at a smooth 20 with 100% uptime!

### <a:Attacks:1573382140006244363> 🛡️ Anti-DDoS Shield Highlights:
> ✦ **1.2+ Tbps Filtering Pipeline:** Effortlessly absorbs volumetric bot attacks.
> ✦ **Minecraft Protocol Intelligence:** Instantly filters packet spoofing & ping exploits.
> ✦ **Zero Attack Downtime:** Immediate automated scrubbing with zero player lag.`;

const sectionStarter =
`### <a:b_fire:1573381944702533732> Starter Tier Plans

> 🪨 **Coal • Ember** \`[ 2 GB ]\`
> ✦ <:RAM:1573382492973568062> \`2 GB DDR4\` ┃ <:cpu:1573382485310709781> \`1 Core\` ┃ <:disk:1573382500795818114> \`15 GB NVMe\` ┃ <a:cash:1573382269735805008> \`₹200 /mo\`
> 
> 🥉 **Copper • Spark** \`[ 4 GB ]\`
> ✦ <:RAM:1573382492973568062> \`4 GB DDR4\` ┃ <:cpu:1573382485310709781> \`1 Core\` ┃ <:disk:1573382500795818114> \`25 GB NVMe\` ┃ <a:cash:1573382269735805008> \`₹400 /mo\`
> 
> ⛓️ **Iron • Flare** \`[ 6 GB ]\`
> ✦ <:RAM:1573382492973568062> \`6 GB DDR4\` ┃ <:cpu:1573382485310709781> \`2 Cores\` ┃ <:disk:1573382500795818114> \`35 GB NVMe\` ┃ <a:cash:1573382269735805008> \`₹600 /mo\``;

const sectionCommunity =
`### <a:Lightning:1573382171257737317> Community & Expansion Plans

> 🪙 **Gold • Blaze** \`[ 8 GB ]\`
> ✦ <:RAM:1573382492973568062> \`8 GB DDR4\` ┃ <:cpu:1573382485310709781> \`2 Cores\` ┃ <:disk:1573382500795818114> \`50 GB NVMe\` ┃ <a:cash:1573382269735805008> \`₹750 /mo\`
> 
> ❇️ **Emerald • Aurora** \`[ 12 GB ]\`
> ✦ <:RAM:1573382492973568062> \`12 GB DDR4\` ┃ <:cpu:1573382485310709781> \`3 Cores\` ┃ <:disk:1573382500795818114> \`75 GB NVMe\` ┃ <a:cash:1573382269735805008> \`₹1,150 /mo\`
> 
> 💎 **Diamond • Nova** \`[ 16 GB ]\`
> ✦ <:RAM:1573382492973568062> \`16 GB DDR4\` ┃ <:cpu:1573382485310709781> \`4 Cores\` ┃ <:disk:1573382500795818114> \`100 GB NVMe\` ┃ <a:cash:1573382269735805008> \`₹1,500 /mo\``;

const sectionHeavy =
`### <a:RedCrown:1573382179298353186> Heavy Modded & Network Plans

> 🖤 **Netherite • Eclipse** \`[ 24 GB ]\`
> ✦ <:RAM:1573382492973568062> \`24 GB DDR4\` ┃ <:cpu:1573382485310709781> \`6 Cores\` ┃ <:disk:1573382500795818114> \`120 GB NVMe\` ┃ <a:cash:1573382269735805008> \`₹2,250 /mo\`
> 
> 🗼 **Beacon • Zenith** \`[ 32 GB ]\`
> ✦ <:RAM:1573382492973568062> \`32 GB DDR4\` ┃ <:cpu:1573382485310709781> \`8 Cores\` ┃ <:disk:1573382500795818114> \`150 GB NVMe\` ┃ <a:cash:1573382269735805008> \`₹3,000 /mo\`
> 
> 👁️ **Ender • Galaxy** \`[ 48 GB ]\`
> ✦ <:RAM:1573382492973568062> \`48 GB DDR4\` ┃ <:cpu:1573382485310709781> \`12 Cores\` ┃ <:disk:1573382500795818114> \`220 GB NVMe\` ┃ <a:cash:1573382269735805008> \`₹4,500 /mo\`
> 
> 🐲 **Dragon • Cosmos** \`[ 64 GB ]\`
> ✦ <:RAM:1573382492973568062> \`64 GB DDR4\` ┃ <:cpu:1573382485310709781> \`16 Cores\` ┃ <:disk:1573382500795818114> \`300 GB NVMe\` ┃ <a:cash:1573382269735805008> \`₹6,000 /mo\``;

const sectionFooter =
`### <a:sparkles_sparkles:1573382447603785928> All Budget Plans Include:
> <:bandwith55:1573382523201912842> **1 Gbps High-Speed Network Uplink** ┃ <:backup:1573382515341664270> **Automated Off-site Daily Snapshots**
> <a:Tick5:1573382205395177532> **Custom Pterodactyl Panel** (SFTP, Full Root File Access, Split Ports)
> <a:Attacks:1573382140006244363> **Always-On Anti-DDoS Mitigation** ┃ <a:hostinger:1573382335355691089> **Instant Node Provisioning**`;

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
          content: sectionStarter
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionCommunity
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionHeavy
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionFooter
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
              label: 'Open Ticket to Order',
              url: ticketChannelUrl,
              emoji: { name: '🎫' }
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
          content: '-# 🛡️ Dream Nodes • Enterprise Anti-DDoS Protected Minecraft Hosting'
        }
      ]
    }
  ]
};

async function updateBudgetPlans() {
  console.log('Updating Budget Plans V2 Container...');
  const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(v2Payload)
  });

  const data = await res.json();
  if (data.id) {
    console.log('✓ Successfully updated Budget Plans embed! Message ID:', data.id);
  } else {
    console.error('✗ Failed to update:', JSON.stringify(data, null, 2));
  }
}

updateBudgetPlans();
