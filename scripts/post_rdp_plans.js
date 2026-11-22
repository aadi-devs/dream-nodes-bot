const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281556968112248'; // # ⚜・ʀᴅᴘ-ᴘʟᴀɴꜱ
const messageId = '1573766690842476596';
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.cloud';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# ${E.pc} DREAM NODES ┃ Premium Windows RDP Hosting
## ${E.location} ${E.india} India Datacenter (Noida) • Intel Xeon • Full Administrator Access

> ${E.attacks} **Dedicated Cloud Windows Desktops:** Powered by high-clock Intel Xeon compute, ultra-fast Gen4 NVMe storage, unmetered 1 Gbps networking, and pre-activated Windows Server environments.`;

const sectionSmall =
`### ${E.fireBlue} Starter & Basic RDP Plans

> ${E.arrowOrange} **RDP S** \`[ STARTER ]\` ── ${E.cash} **\`₹699 /mo\`**
> ${E.cpu} \`2 Intel vCores\` ┃ ${E.ram} \`6 GB ECC RAM\` ┃ ${E.disk} \`60 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\`
> 
> ${E.arrowOrange} **RDP M** \`[ STANDARD ]\` ── ${E.cash} **\`₹899 /mo\`**
> ${E.cpu} \`4 Intel vCores\` ┃ ${E.ram} \`8 GB ECC RAM\` ┃ ${E.disk} \`80 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\``;

const sectionMedium =
`### ${E.lightning} Advanced & Heavy Multi-Tasking RDP

> ${E.lightning} **RDP M+** \`[ ADVANCED ]\` ── ${E.cash} **\`₹1,199 /mo\`**
> ${E.cpu} \`6 Intel vCores\` ┃ ${E.ram} \`16 GB ECC RAM\` ┃ ${E.disk} \`150 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\`
> 
> ${E.lightning} **RDP L** \`[ PLUS ]\` ── ${E.cash} **\`₹1,499 /mo\`**
> ${E.cpu} \`8 Intel vCores\` ┃ ${E.ram} \`24 GB ECC RAM\` ┃ ${E.disk} \`200 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\`
> 
> ${E.lightning} **RDP XL** \`[ PRO ]\` ── ${E.cash} **\`₹1,899 /mo\`**
> ${E.cpu} \`10 Intel vCores\` ┃ ${E.ram} \`32 GB ECC RAM\` ┃ ${E.disk} \`300 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\``;

const sectionBig =
`### ${E.crownRed} Heavyweight Enterprise RDP (Heavy Workloads & Emulators)

> ${E.crownRed} **RDP XXL** \`[ POWER ]\` ── ${E.cash} **\`₹2,299 /mo\`**
> ${E.cpu} \`12 Intel vCores\` ┃ ${E.ram} \`48 GB ECC RAM\` ┃ ${E.disk} \`350 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\`
> 
> ${E.crownRed} **RDP 2XL** \`[ ELITE ]\` ── ${E.cash} **\`₹2,799 /mo\`**
> ${E.cpu} \`16 Intel vCores\` ┃ ${E.ram} \`64 GB ECC RAM\` ┃ ${E.disk} \`400 GB NVMe\` ┃ ${E.bandwidth} \`1 Gbps Unmetered\``;

const sectionFeatures =
`### ${E.sparkles} Core Windows RDP Capabilities & Inclusions:
> ${E.security} **100% Full Admin Access:** Complete control. Install any desktop app, bot, emulator, or tool.
> ${E.pc} **Windows Remote Desktop:** Connect smoothly via Windows MSTSC, macOS, iOS, or Android devices.
> ${E.india} **Hosted in Noida, India:** Ultra-low ping and direct domestic routing across India and South Asia.
> ${E.shield} **Advanced Anti-DDoS Mitigation:** Real-time multi-Tbps traffic scrubbing protecting you 24/7.
> ${E.bandwidth} **Truly Unmetered 1 Gbps Port:** Run uploads and downloads with zero speed throttling.
> ${E.disk} **Pure Gen4 NVMe Storage:** Fast drive read/write speeds for instant responsiveness.
> ${E.rocket} **Instant Setup:** Fast automated deployment dispatched immediately upon ticket verification.`;

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
              label: 'Order RDP Server / Open Ticket',
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
          content: `-# ${E.verifiedBlue} Dream Nodes • Enterprise High-Speed Windows RDP Cloud Desktops`
        }
      ]
    }
  ]
};

async function updateRdpPlans() {
  console.log('Patching RDP Plans embed in channel', channelId);
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
    console.log('✓ Successfully updated RDP Plans embed! Message ID:', patchData.id);
  } else {
    console.error('✗ Failed to patch RDP Plans:', JSON.stringify(patchData, null, 2));
  }
}

if (require.main === module) {
  updateRdpPlans();
}

module.exports = { updateRdpPlans, v2Payload };
