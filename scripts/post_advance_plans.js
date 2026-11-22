const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281486822445128'; // # ♘・ᴀᴅᴠᴀɴᴄᴇ-ᴘʟᴀɴꜱ
const messageId = '1573688254908207249';
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.cloud';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# ${E.minecraft} Dream Nodes | Advance Minecraft Hosting
## ${E.attacks} ${E.shield} Enterprise Game-Shield Protected Nodes

> ${E.siren} **MILITARY-GRADE DEFENSE INCLUDED ON ALL ADVANCE PLANS**
> ${E.lightning} Fortified with automated **Layer 4 & Layer 7 Game Mitigation** built specifically for Minecraft protocols. Our edge filters intercept UDP/TCP floods, SYN storms, null-ping exploits, and bot raids in real time with **sub-second reaction**—keeping servers locked at 20 TPS with zero downtime.

### ${E.hostinger} Key Defense Capabilities:
> ${E.arrowBlue} **1.2+ Tbps Traffic Pipeline:** Absorbs massive volumetric attacks.
> ${E.arrowBlue} **Minecraft Protocol Scrubbing:** Cleans packet spoofing & ping exploits on the fly.
> ${E.arrowBlue} **Zero Disconnects:** Instant mitigation with zero player lag spikes.`;

const sectionStarter =
`### ${E.fireBlue} Starter Tier Plans

> ${E.coal} **Coal • Ember** \`[ 2 GB ]\` ➔ ${E.cash} \`₹200 /mo\`
> ${E.arrowBlue} \`2 GB DDR4\` ┃ \`1 Core\` ┃ \`15 GB NVMe\`
> 
> ${E.copper} **Copper • Spark** \`[ 4 GB ]\` ➔ ${E.cash} \`₹400 /mo\`
> ${E.arrowBlue} \`4 GB DDR4\` ┃ \`1 Core\` ┃ \`25 GB NVMe\`
> 
> ${E.iron} **Iron • Flare** \`[ 6 GB ]\` ➔ ${E.cash} \`₹600 /mo\`
> ${E.arrowBlue} \`6 GB DDR4\` ┃ \`2 Cores\` ┃ \`35 GB NVMe\``;

const sectionCommunity =
`### ${E.lightning} Community & Expansion Plans

> ${E.gold} **Gold • Blaze** \`[ 8 GB ]\` ➔ ${E.cash} \`₹750 /mo\`
> ${E.arrowBlue} \`8 GB DDR4\` ┃ \`2 Cores\` ┃ \`50 GB NVMe\`
> 
> ${E.emerald} **Emerald • Aurora** \`[ 12 GB ]\` ➔ ${E.cash} \`₹1,150 /mo\`
> ${E.arrowBlue} \`12 GB DDR4\` ┃ \`3 Cores\` ┃ \`75 GB NVMe\`
> 
> ${E.diamond} **Diamond • Nova** \`[ 16 GB ]\` ➔ ${E.cash} \`₹1,500 /mo\`
> ${E.arrowBlue} \`16 GB DDR4\` ┃ \`4 Cores\` ┃ \`100 GB NVMe\``;

const sectionHeavy =
`### ${E.crownRed} Heavy Modded & Network Plans

> ${E.sword} **Netherite • Eclipse** \`[ 24 GB ]\` ➔ ${E.cash} \`₹2,250 /mo\`
> ${E.arrowBlue} \`24 GB DDR4\` ┃ \`6 Cores\` ┃ \`120 GB NVMe\`
> 
> ${E.starRotating} **Beacon • Zenith** \`[ 32 GB ]\` ➔ ${E.cash} \`₹3,000 /mo\`
> ${E.arrowBlue} \`32 GB DDR4\` ┃ \`8 Cores\` ┃ \`150 GB NVMe\`
> 
> ${E.enderman} **Ender • Galaxy** \`[ 48 GB ]\` ➔ ${E.cash} \`₹4,500 /mo\`
> ${E.arrowBlue} \`48 GB DDR4\` ┃ \`12 Cores\` ┃ \`220 GB NVMe\`
> 
> ${E.vip} **Dragon • Cosmos** \`[ 64 GB ]\` ➔ ${E.cash} \`₹6,000 /mo\`
> ${E.arrowBlue} \`64 GB DDR4\` ┃ \`16 Cores\` ┃ \`300 GB NVMe\``;

const sectionFooter =
`### ${E.sparkles} All Advance Plans Include:
> ${E.bandwidth} **1 Gbps Network Uplink** ┃ ${E.backup} **Automated Off-site Daily Snapshots**
> ${E.tick5} **Custom Pterodactyl Panel** (SFTP, Full Root File Access, Split Ports)
> ${E.hostinger} **Instant Provisioning Upon Ticket Confirmation**

### ${E.settings} Add-ons & Dedicated IP:
> ${E.world} **Dedicated IPv4 + Default Port (25565):** ${E.cash} \`₹350 /mo\` (Direct join without port!)`;

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
          content: `-# ${E.security} Dream Nodes • Enterprise Protected Advance Minecraft Hosting Solutions`
        }
      ]
    }
  ]
};

async function updateAdvancePlans() {
  console.log('Updating Advance Plans V2 Container...');
  const totalChars = [sectionHeader, sectionStarter, sectionCommunity, sectionHeavy, sectionFooter].reduce((acc, s) => acc + s.length, 0);
  console.log(`Payload character count: ${totalChars} / 4000`);

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
    console.log('✓ Successfully updated Advance Plans embed! Message ID:', data.id);
  } else {
    console.error('✗ Failed to update:', JSON.stringify(data, null, 2));
  }
}

if (require.main === module) {
  updateAdvancePlans();
}

module.exports = { updateAdvancePlans, v2Payload };
