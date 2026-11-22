const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281509140336816'; // # ♘・ɪɴᴛᴇʟ-ᴠᴘꜱ-ᴘʟᴀɴꜱ
const messageId = '1573741063175151717';
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.cloud';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# ${E.vps} DREAM NODES ┃ Intel Xeon VPS
## ${E.lightning} High-Frequency Intel Compute • Pure Gen4 NVMe • Full Root Control

> ${E.attacks} **Tier-IV Enterprise Intel Cloud Nodes:** Engineered for sustained high single-core clocks, gaming networks, bot swarms, heavy APIs, and microservices.`;

const sectionSmall =
`### ${E.fireBlue} Starter & Development Nodes

> ${E.arrowOrange} **PLAN-B** ── ${E.cash} **\`₹499 /mo\`**
> ${E.cpu} \`1 Intel vCore\` ┃ ${E.ram} \`6 GB RAM\`
> ${E.disk} \`40 GB Gen4 NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\`
> 
> ${E.arrowOrange} **PLAN-C** ── ${E.cash} **\`₹599 /mo\`**
> ${E.cpu} \`2 Intel vCores\` ┃ ${E.ram} \`8 GB RAM\`
> ${E.disk} \`60 GB Gen4 NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\`
> 
> ${E.arrowOrange} **PLAN-D** ── ${E.cash} **\`₹799 /mo\`**
> ${E.cpu} \`3 Intel vCores\` ┃ ${E.ram} \`12 GB RAM\`
> ${E.disk} \`80 GB Gen4 NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\``;

const sectionBig =
`### ${E.lightning} Production & High-Load Nodes

> ${E.lightning} **PLAN-E** ── ${E.cash} **\`₹1,099 /mo\`**
> ${E.cpu} \`4 Intel vCores\` ┃ ${E.ram} \`16 GB RAM\`
> ${E.disk} \`100 GB Gen4 NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\`
> 
> ${E.lightning} **PLAN-F** ── ${E.cash} **\`₹1,299 /mo\`**
> ${E.cpu} \`6 Intel vCores\` ┃ ${E.ram} \`24 GB RAM\`
> ${E.disk} \`120 GB Gen4 NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\`
> 
> ${E.lightning} **PLAN-G** ── ${E.cash} **\`₹1,499 /mo\`**
> ${E.cpu} \`8 Intel vCores\` ┃ ${E.ram} \`32 GB RAM\`
> ${E.disk} \`150 GB Gen4 NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\``;

const sectionBiggest =
`### ${E.crownRed} Heavyweight Enterprise Dedicated Nodes

> ${E.crownRed} **PLAN-H** ── ${E.cash} **\`₹2,099 /mo\`**
> ${E.cpu} \`10 Intel vCores\` ┃ ${E.ram} \`48 GB RAM\`
> ${E.disk} \`200 GB Gen4 NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\`
> 
> ${E.crownRed} **PLAN-I** ── ${E.cash} **\`₹2,499 /mo\`**
> ${E.cpu} \`12 Intel vCores\` ┃ ${E.ram} \`64 GB RAM\`
> ${E.disk} \`250 GB Gen4 NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\``;

const sectionFooter =
`### ${E.sparkles} Enterprise VPS Specifications & Inclusions:
> ${E.shield} **Multi-Tbps Anti-DDoS Mitigation:** Automated L4 & L7 real-time traffic scrubbing 24/7.
> ${E.security} **100% Full Root & Sudo Control:** Full SSH / RDP root privileges with no lock-ins.
> ${E.bandwidth} **Truly Unmetered Bandwidth:** Unlimited 1 Gbps port with zero throttling.
> ${E.world} **Dedicated Clean IPv4:** Every virtual machine includes a dedicated static IPv4 address.
> ${E.server} **OS Choices:** Ubuntu 22.04/24.04 LTS, Debian 12, AlmaLinux, CentOS, Windows Server 2022.
> ${E.rocket} **Instant Setup:** Automated provisioning dispatched immediately upon ticket verification.`;

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
          content: sectionBig
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionBiggest
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
              label: 'Order VPS / Open Ticket',
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
          content: `-# ${E.verifiedBlue} Dream Nodes • Enterprise High-Performance Intel Cloud VPS`
        }
      ]
    }
  ]
};

async function updateIntelVpsPlans() {
  console.log('Patching Intel VPS Plans embed in channel', channelId);
  const totalChars = [sectionHeader, sectionSmall, sectionBig, sectionBiggest, sectionFooter].reduce((acc, s) => acc + s.length, 0);
  console.log(`Payload character count: ${totalChars} / 4000`);

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
    console.log('✓ Successfully updated Intel VPS Plans embed! Message ID:', patchData.id);
  } else {
    console.error('✗ Failed to patch Intel VPS plans:', JSON.stringify(patchData, null, 2));
  }
}

if (require.main === module) {
  updateIntelVpsPlans();
}

module.exports = { updateIntelVpsPlans, v2Payload };
