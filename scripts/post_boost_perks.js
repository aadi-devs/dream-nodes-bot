const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281583388168297'; // # ➤・ʙᴏᴏꜱᴛ-ᴘᴇʀᴋꜱ
const messageId = '1573744973294084168';
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.cloud';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# ${E.crownRed} DREAM NODES ┃ Server Boost Perks!
## ${E.booster} Supercharge Your Gaming With Nitro Boost Rewards!

> ${E.sparkles} **Support Our Server & Claim Free High-Spec Cloud Nodes!** Boost Dream Nodes to help elevate our server level and immediately unlock powerful, dedicated gaming servers with zero subscription fees!`;

const sectionTiers =
`### ${E.diamond} Boost Reward Tiers:

> ${E.booster} **TIER 1** ── **\`1 Server Boost\`**
> ${E.ram} **RAM:** \`4 GB\` ┃ ${E.cpu} **CPU:** \`150%\` ┃ ${E.disk} **Disk:** \`10 GB NVMe\`
> 
> ${E.booster} **TIER 2** ── **\`2 Server Boosts\`**
> ${E.ram} **RAM:** \`8 GB\` ┃ ${E.cpu} **CPU:** \`300%\` ┃ ${E.disk} **Disk:** \`20 GB NVMe\``;

const sectionPerks =
`### ${E.supporter} Exclusive VIP Booster Privileges:
> ${E.arrowBlue} **Special Booster Role:** Exclusive role and distinct pink color highlight in member lists.
> ${E.arrowBlue} **Priority Support Queue:** Fast-track responses from support staff for tickets.
> ${E.arrowBlue} **Early Access:** First to test new server locations, nodes, and experimental features.
> ${E.arrowBlue} **Enhanced Chat Permissions:** Post links and custom external stickers freely.`;

const sectionTos =
`### ${E.info} Terms & Conditions:
> ${E.tick5} **Boost Validity:** Plans remain active 24/7 while your Nitro boost remains active on the server.
> ${E.tick5} **Service Notice:** Free reward tiers carry best-effort hosting (no guarantee of uptime or data).
> ${E.rocket} **Data Safety:** Take daily backups of your server worlds and configs for safety.

> ${E.sparkles} **By claiming rewards, you accept our TOS.**`;

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
          content: sectionTiers
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionPerks
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionTos
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
              label: 'Claim Boost Perk / Open Ticket',
              url: ticketChannelUrl,
              emoji: B.diamond
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
              label: 'How To Buy / FAQ',
              url: howToBuyUrl,
              emoji: B.info
            }
          ]
        },
        {
          type: 10,
          content: `-# ${E.verifiedBlue} Dream Nodes Community Perks • Thank You For Supporting Our Server!`
        }
      ]
    }
  ]
};

async function updateBoostPerks() {
  console.log('Patching Boost Perks embed in channel', channelId);
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
    console.log('✓ Successfully updated Boost Perks embed! Message ID:', patchData.id);
  } else {
    console.error('✗ Failed to patch Boost Perks:', JSON.stringify(patchData, null, 2));
  }
}

if (require.main === module) {
  updateBoostPerks();
}

module.exports = { updateBoostPerks, v2Payload };
