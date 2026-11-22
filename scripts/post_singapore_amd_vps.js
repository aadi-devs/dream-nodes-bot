const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281523380133910'; // # ♘・ꜱɪɴɢᴀᴘᴏʀᴇ-ᴀᴍᴅ-ᴠᴘꜱ
const messageId = '1573767507922133024';
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.cloud';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# ${E.vps} DREAM NODES ┃ Singapore AMD EPYC™ VPS
## ${E.location} ${E.singapore} Singapore Equinix Datacenter • Gen4 NVMe • Full Root Control

> ${E.attacks} **Next-Gen Asia-Pacific Multi-Thread Compute:** Powered by high-efficiency AMD EPYC™ architecture in premium Singapore facilities. Designed for heavy multi-threading, international game servers, web microservices, and bot swarms with direct subsea Asian routing.`;

const sectionSmall =
`### ${E.fireBlue} Starter & Development Nodes (Singapore)

> ${E.arrowOrange} **PLAN-B** ── ${E.cash} **\`₹549 /mo\`**
> ${E.cpu} \`1 AMD EPYC™ vCore\` ┃ ${E.ram} \`6 GB RAM\`
> ${E.disk} \`20 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\`
> 
> ${E.arrowOrange} **PLAN-C** ── ${E.cash} **\`₹699 /mo\`**
> ${E.cpu} \`2 AMD EPYC™ vCores\` ┃ ${E.ram} \`8 GB RAM\`
> ${E.disk} \`35 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\`
> 
> ${E.arrowOrange} **PLAN-D** ── ${E.cash} **\`₹949 /mo\`**
> ${E.cpu} \`3 AMD EPYC™ vCores\` ┃ ${E.ram} \`12 GB RAM\`
> ${E.disk} \`50 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\``;

const sectionMedium =
`### ${E.lightning} Production & High-Load Nodes (Singapore)

> ${E.lightning} **PLAN-E** ── ${E.cash} **\`₹1,299 /mo\`**
> ${E.cpu} \`4 AMD EPYC™ vCores\` ┃ ${E.ram} \`16 GB RAM\`
> ${E.disk} \`60 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\`
> 
> ${E.lightning} **PLAN-F** ── ${E.cash} **\`₹1,599 /mo\`**
> ${E.cpu} \`5 AMD EPYC™ vCores\` ┃ ${E.ram} \`24 GB RAM\`
> ${E.disk} \`100 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\`
> 
> ${E.lightning} **PLAN-G** ── ${E.cash} **\`₹1,899 /mo\`**
> ${E.cpu} \`6 AMD EPYC™ vCores\` ┃ ${E.ram} \`32 GB RAM\`
> ${E.disk} \`120 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\``;

const sectionBig =
`### ${E.crownRed} Heavyweight Enterprise Dedicated Nodes (Singapore)

> ${E.crownRed} **PLAN-H** ── ${E.cash} **\`₹2,499 /mo\`**
> ${E.cpu} \`7 AMD EPYC™ vCores\` ┃ ${E.ram} \`48 GB RAM\`
> ${E.disk} \`160 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\`
> 
> ${E.crownRed} **PLAN-I** ── ${E.cash} **\`₹2,999 /mo\`**
> ${E.cpu} \`8 AMD EPYC™ vCores\` ┃ ${E.ram} \`64 GB RAM\`
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
              label: 'Order SG AMD VPS / Open Ticket',
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
          content: `-# ${E.verifiedBlue} Dream Nodes • Ultra-Low Latency Singapore AMD EPYC™ Cloud VPS`
        }
      ]
    }
  ]
};

async function updateSingaporeAmdVps() {
  console.log('Patching Singapore AMD EPYC VPS Plans embed in channel', channelId);
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
    console.log('✓ Successfully updated Singapore AMD EPYC VPS Plans embed! Message ID:', patchData.id);
  } else {
    console.error('✗ Failed to patch Singapore AMD EPYC VPS plans:', JSON.stringify(patchData, null, 2));
  }
}

if (require.main === module) {
  updateSingaporeAmdVps();
}

module.exports = { updateSingaporeAmdVps, v2Payload };
