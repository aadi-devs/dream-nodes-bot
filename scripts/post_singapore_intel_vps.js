const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281518787494048'; // # ♘・ꜱɪɴɢᴀᴘᴏʀᴇ-ɪɴᴛᴇʟ-ᴠᴘꜱ
const messageId = '1573767120104202341';
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.cloud';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# ${E.vps} DREAM NODES ┃ Singapore Intel Xeon VPS
## ${E.location} ${E.singapore} Singapore Equinix Datacenter • Gen4 NVMe • Full Root Control

> ${E.attacks} **Ultra-Low Latency Asia-Pacific Cloud Nodes:** High-frequency Intel Xeon computing hosted in tier-grade Singapore facilities. Direct subsea fiber routing to India, Southeast Asia, Japan, and Oceania with unmetered 1 Gbps connectivity.`;

const sectionSmall =
`### ${E.fireBlue} Starter & Development Nodes (Singapore)

> ${E.arrowOrange} **PLAN-B** ── ${E.cash} **\`₹499 /mo\`**
> ${E.cpu} \`1 Intel vCore\` ┃ ${E.ram} \`6 GB RAM\`
> ${E.disk} \`20 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\`
> 
> ${E.arrowOrange} **PLAN-C** ── ${E.cash} **\`₹599 /mo\`**
> ${E.cpu} \`2 Intel vCores\` ┃ ${E.ram} \`8 GB RAM\`
> ${E.disk} \`35 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\`
> 
> ${E.arrowOrange} **PLAN-D** ── ${E.cash} **\`₹849 /mo\`**
> ${E.cpu} \`3 Intel vCores\` ┃ ${E.ram} \`12 GB RAM\`
> ${E.disk} \`50 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\``;

const sectionMedium =
`### ${E.lightning} Production & High-Load Nodes (Singapore)

> ${E.lightning} **PLAN-E** ── ${E.cash} **\`₹1,199 /mo\`**
> ${E.cpu} \`4 Intel vCores\` ┃ ${E.ram} \`16 GB RAM\`
> ${E.disk} \`60 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\`
> 
> ${E.lightning} **PLAN-F** ── ${E.cash} **\`₹1,449 /mo\`**
> ${E.cpu} \`5 Intel vCores\` ┃ ${E.ram} \`24 GB RAM\`
> ${E.disk} \`100 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\`
> 
> ${E.lightning} **PLAN-G** ── ${E.cash} **\`₹1,699 /mo\`**
> ${E.cpu} \`6 Intel vCores\` ┃ ${E.ram} \`32 GB RAM\`
> ${E.disk} \`120 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\``;

const sectionBig =
`### ${E.crownRed} Heavyweight Enterprise Dedicated Nodes (Singapore)

> ${E.crownRed} **PLAN-H** ── ${E.cash} **\`₹2,299 /mo\`**
> ${E.cpu} \`7 Intel vCores\` ┃ ${E.ram} \`48 GB RAM\`
> ${E.disk} \`160 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\`
> 
> ${E.crownRed} **PLAN-I** ── ${E.cash} **\`₹2,799 /mo\`**
> ${E.cpu} \`8 Intel vCores\` ┃ ${E.ram} \`64 GB RAM\`
> ${E.disk} \`200 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\``;

const sectionFeatures =
`### ${E.sparkles} Singapore VPS Specifications & Inclusions:
> ${E.shield} **Multi-Tbps Anti-DDoS Mitigation:** Automated real-time scrubbing protection.
> ${E.security} **100% Full Root & Sudo Access:** Dedicated SSH / RDP with zero restrictions.
> ${E.bandwidth} **Truly Unmetered 1 Gbps Bandwidth:** Zero throttling, high Asia-Pacific bandwidth.
> ${E.world} **Dedicated Clean IPv4:** Included static IPv4 address with every VPS.
> ${E.server} **OS Choices:** Ubuntu 22.04/24.04 LTS, Debian 12, AlmaLinux, Windows Server 2022.
> ${E.rocket} **Instant Automated Setup:** Delivered immediately upon ticket verification.`;

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
              label: 'Order SG VPS / Open Ticket',
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
          content: `-# ${E.verifiedBlue} Dream Nodes • Ultra-Low Latency Singapore Intel Cloud VPS`
        }
      ]
    }
  ]
};

async function updateSingaporeIntelVps() {
  console.log('Patching Singapore Intel VPS Plans embed in channel', channelId);
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
    console.log('✓ Successfully updated Singapore Intel VPS Plans embed! Message ID:', patchData.id);
  } else {
    console.error('✗ Failed to patch Singapore Intel VPS plans:', JSON.stringify(patchData, null, 2));
  }
}

if (require.main === module) {
  updateSingaporeIntelVps();
}

module.exports = { updateSingaporeIntelVps, v2Payload };
