const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281486822445128'; // # ♘・ʙᴜᴅɢᴇᴛ-ᴘʟᴀɴꜱ
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.com';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const content =
`# <a:minecraft:1573382379215659081> Dream Nodes | Budget Minecraft Plans
## <a:b_fire:1573381944702533732> High-Performance • Budget-Friendly Nodes

> <a:hostinger:1573382335355691089> Reliable, budget-friendly game hosting tailored for vanilla survival, modpacks, and multi-player smps. All plans run on enterprise NVMe SSD arrays with automated 24/7 DDoS filtration and unmetered network connectivity.

---

### <a:b_fire:1573381944702533732> Starter Tier Plans

> 🪨 **Coal • Ember** \`[ 2 GB ]\`
> ✦ **RAM:** <:RAM:1573382492973568062> \`2 GB DDR4\` ┃ **CPU:** <:cpu:1573382485310709781> \`1 Dedicated Core\`
> ✦ **Price:** <a:cash:1573382269735805008> \`₹200 /month\`
> 
> 🥉 **Copper • Spark** \`[ 4 GB ]\`
> ✦ **RAM:** <:RAM:1573382492973568062> \`4 GB DDR4\` ┃ **CPU:** <:cpu:1573382485310709781> \`1 Dedicated Core\`
> ✦ **Price:** <a:cash:1573382269735805008> \`₹400 /month\`
> 
> ⛓️ **Iron • Flare** \`[ 6 GB ]\`
> ✦ **RAM:** <:RAM:1573382492973568062> \`6 GB DDR4\` ┃ **CPU:** <:cpu:1573382485310709781> \`2 Dedicated Cores\`
> ✦ **Price:** <a:cash:1573382269735805008> \`₹600 /month\`

### <a:Lightning:1573382171257737317> Community & Expansion Plans

> 🪙 **Gold • Blaze** \`[ 8 GB ]\`
> ✦ **RAM:** <:RAM:1573382492973568062> \`8 GB DDR4\` ┃ **CPU:** <:cpu:1573382485310709781> \`2 Dedicated Cores\`
> ✦ **Price:** <a:cash:1573382269735805008> \`₹750 /month\`
> 
> ❇️ **Emerald • Aurora** \`[ 12 GB ]\`
> ✦ **RAM:** <:RAM:1573382492973568062> \`12 GB DDR4\` ┃ **CPU:** <:cpu:1573382485310709781> \`3 Dedicated Cores\`
> ✦ **Price:** <a:cash:1573382269735805008> \`₹1,150 /month\`
> 
> 💎 **Diamond • Nova** \`[ 16 GB ]\`
> ✦ **RAM:** <:RAM:1573382492973568062> \`16 GB DDR4\` ┃ **CPU:** <:cpu:1573382485310709781> \`4 Dedicated Cores\`
> ✦ **Price:** <a:cash:1573382269735805008> \`₹1,500 /month\`

### <a:RedCrown:1573382179298353186> Heavy Modded & Network Plans

> 🖤 **Netherite • Eclipse** \`[ 24 GB ]\`
> ✦ **RAM:** <:RAM:1573382492973568062> \`24 GB DDR4\` ┃ **CPU:** <:cpu:1573382485310709781> \`6 Dedicated Cores\`
> ✦ **Price:** <a:cash:1573382269735805008> \`₹2,250 /month\`
> 
> 🗼 **Beacon • Zenith** \`[ 32 GB ]\`
> ✦ **RAM:** <:RAM:1573382492973568062> \`32 GB DDR4\` ┃ **CPU:** <:cpu:1573382485310709781> \`8 Dedicated Cores\`
> ✦ **Price:** <a:cash:1573382269735805008> \`₹3,000 /month\`
> 
> 👁️ **Ender • Galaxy** \`[ 48 GB ]\`
> ✦ **RAM:** <:RAM:1573382492973568062> \`48 GB DDR4\` ┃ **CPU:** <:cpu:1573382485310709781> \`12 Dedicated Cores\`
> ✦ **Price:** <a:cash:1573382269735805008> \`₹4,500 /month\`
> 
> 🐲 **Dragon • Cosmos** \`[ 64 GB ]\`
> ✦ **RAM:** <:RAM:1573382492973568062> \`64 GB DDR4\` ┃ **CPU:** <:cpu:1573382485310709781> \`16 Dedicated Cores\`
> ✦ **Price:** <a:cash:1573382269735805008> \`₹6,000 /month\`

---

### <a:sparkles_sparkles:1573382447603785928> Standard Features Included:
> <:disk:1573382500795818114> **Unmetered NVMe SSD Storage** ┃ <:bandwith55:1573382523201912842> **1 Gbps Uplink**
> <:backup:1573382515341664270> **Automated Daily Backups** ┃ <a:Attacks:1573382140006244363> **Anti-DDoS Protection**
> <a:Tick5:1573382205395177532> **Pterodactyl Panel Access** (SFTP, Databases, Split Server Ports)`;

const v2Payload = {
  flags: 32768, // IS_COMPONENTS_V2
  components: [
    {
      type: 17, // Borderless Container
      components: [
        {
          type: 10,
          content: content
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
          content: '-# 💙 Dream Nodes • Pocket-Friendly Minecraft Hosting Solutions'
        }
      ]
    }
  ]
};

async function postBudgetPlans() {
  console.log('Posting Budget Plans V2 Container...');
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
    console.log('✓ Successfully posted Budget Plans embed! Message ID:', data.id);
  } else {
    console.error('✗ Failed to post:', data);
  }
}

postBudgetPlans();
