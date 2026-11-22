const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281565763567676'; // # ⚜・ꜱᴛᴏʀᴀɢᴇ-ꜱᴇʀᴠᴇʀꜱ
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.cloud';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# <:disk:1573382500795818114> 𝐃𝐑𝐄𝐀𝐌 𝐍𝐎𝐃𝐄𝐒 ┃ High-Capacity Storage Servers
## <:backup:1573382515341664270> 📦 Terabyte Cloud Storage • NVMe-Cached • Dedicated IPv4 & Full Root

> <a:Attacks:1573382140006244363> **Enterprise Mass Storage Infrastructure:** Built for offsite backups, media streaming (Plex / Jellyfin), Nextcloud / OwnCloud cloud drives, game archives, and cold data storage on enterprise-grade hardware.`;

const sectionPlans =
`### <a:b_fire:1573381944702533732> Dedicated High-Capacity Storage Plans:

> 💾 **STORAGE S** ── <a:cash:1573382269735805008> **\`₹1,899 /mo\`**
> <:disk:1573382500795818114> \`1 TB Enterprise Storage\` ┃ <:RAM:1573382492973568062> \`4 GB DDR4\`
> <:cpu:1573382485310709781> \`2 Dedicated vCores\` ┃ 🌐 \`Dedicated IPv4 Included\`
> 
> ⭐ **STORAGE M** \`[ MOST POPULAR ]\` ── <a:cash:1573382269735805008> **\`₹3,199 /mo\`**
> <:disk:1573382500795818114> \`2 TB Enterprise Storage\` ┃ <:RAM:1573382492973568062> \`4 GB DDR4\`
> <:cpu:1573382485310709781> \`2 Dedicated vCores\` ┃ 🌐 \`Dedicated IPv4 Included\`
> 
> 👑 **STORAGE XL** \`[ MAXIMUM STORAGE ]\` ── <a:cash:1573382269735805008> **\`₹5,399 /mo\`**
> <:disk:1573382500795818114> \`5 TB Enterprise Storage\` ┃ <:RAM:1573382492973568062> \`4 GB DDR4\`
> <:cpu:1573382485310709781> \`2 Dedicated vCores\` ┃ 🌐 \`Dedicated IPv4 Included\``;

const sectionFeatures =
`### <a:sparkles_sparkles:1573382447603785928> Built for Serious Storage & Data Safety:
> 🔑 **Full Root / SSH Access:** Complete administrative control. Install Nextcloud, OwnCloud, Samba, FTP, Plex, or Jellyfin.
> 🌐 **Dedicated Clean IPv4:** Every storage server includes a dedicated static IPv4 address.
> 🛡️ **Always-On Anti-DDoS:** Enterprise multi-Tbps volumetric mitigation protecting your server around the clock.
> ⚡ **High-Speed Network Port:** Fast unmetered transfers in and out of your storage server.
> 💽 **Enterprise Storage Drives:** High-reliability drives paired with NVMe caching for smooth I/O.
> 💿 **Linux OS Support:** Deploy Ubuntu 22.04/24.04 LTS, Debian 12, CentOS 7/9, or AlmaLinux.
> 🚀 **Instant Setup:** Fast automated provisioning with 99.9% uptime SLA.`;

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
              emoji: { name: '💾' }
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
          content: '-# 💾 Dream Nodes • Enterprise High-Capacity Cloud Storage Solutions'
        }
      ]
    }
  ]
};

async function postStorageServers() {
  console.log('Posting Storage Servers Plans V2 Container to channel', channelId);
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
    console.log('✓ Successfully posted Storage Servers embed! Message ID:', data.id);
    
    // Add reactions
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${data.id}/reactions/%F0%9F%92%BE/@me`, { // 💾
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${data.id}/reactions/%F0%9F%93%A6/@me`, { // 📦
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
  } else {
    console.error('✗ Failed to post:', JSON.stringify(data, null, 2));
  }
}

postStorageServers();
