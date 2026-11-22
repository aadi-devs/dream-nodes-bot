const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281565763567676'; // # ⚜・ꜱᴛᴏʀᴀɢᴇ-ꜱᴇʀᴠᴇʀꜱ
const messageId = '1573765844138197184';
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.cloud';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# ${E.chest} DREAM NODES ┃ High-Capacity Storage Servers
## ${E.backup} Terabyte Cloud Storage • NVMe-Cached • Dedicated IPv4 & Full Root

> ${E.attacks} **Enterprise Mass Storage Infrastructure:** Built for offsite backups, media streaming (Plex / Jellyfin), Nextcloud / OwnCloud cloud drives, game archives, and cold data storage on enterprise-grade hardware.`;

const sectionPlans =
`### ${E.fireBlue} Dedicated High-Capacity Storage Plans:

> ${E.arrowOrange} **STORAGE S** ── ${E.cash} **\`₹1,899 /mo\`**
> ${E.disk} \`1 TB Enterprise Storage\` ┃ ${E.ram} \`4 GB DDR4\`
> ${E.cpu} \`2 Dedicated vCores\` ┃ ${E.world} \`Dedicated IPv4 Included\`
> 
> ${E.starRotating} **STORAGE M** \`[ MOST POPULAR ]\` ── ${E.cash} **\`₹3,199 /mo\`**
> ${E.disk} \`2 TB Enterprise Storage\` ┃ ${E.ram} \`4 GB DDR4\`
> ${E.cpu} \`2 Dedicated vCores\` ┃ ${E.world} \`Dedicated IPv4 Included\`
> 
> ${E.crownRed} **STORAGE XL** \`[ MAXIMUM STORAGE ]\` ── ${E.cash} **\`₹5,399 /mo\`**
> ${E.disk} \`5 TB Enterprise Storage\` ┃ ${E.ram} \`4 GB DDR4\`
> ${E.cpu} \`2 Dedicated vCores\` ┃ ${E.world} \`Dedicated IPv4 Included\``;

const sectionFeatures =
`### ${E.sparkles} Built for Serious Storage & Data Safety:
> ${E.security} **Full Root / SSH Access:** Complete administrative control. Install Nextcloud, Samba, FTP, Plex, or Jellyfin.
> ${E.world} **Dedicated Clean IPv4:** Every storage server includes a dedicated static IPv4 address.
> ${E.shield} **Always-On Anti-DDoS:** Enterprise multi-Tbps volumetric mitigation protecting your server 24/7.
> ${E.bandwidth} **High-Speed Network Port:** Fast unmetered transfers in and out of your storage server.
> ${E.disk} **Enterprise Storage Drives:** High-reliability drives paired with NVMe caching for smooth I/O.
> ${E.server} **Linux OS Support:** Deploy Ubuntu 22.04/24.04 LTS, Debian 12, CentOS 7/9, or AlmaLinux.
> ${E.rocket} **Instant Setup:** Fast automated provisioning with 99.9% uptime SLA.`;

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
          content: sectionPlans
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
              label: 'Order Storage Server / Open Ticket',
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
          content: `-# ${E.verifiedBlue} Dream Nodes • Enterprise High-Capacity Cloud Storage Solutions`
        }
      ]
    }
  ]
};

async function updateStorageServers() {
  console.log('Patching Storage Servers Plans embed in channel', channelId);
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
    console.log('✓ Successfully updated Storage Servers embed! Message ID:', patchData.id);
  } else {
    console.error('✗ Failed to patch Storage Servers:', JSON.stringify(patchData, null, 2));
  }
}

if (require.main === module) {
  updateStorageServers();
}

module.exports = { updateStorageServers, v2Payload };
