const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281583388168297'; // # ➤・ʙᴏᴏꜱᴛ-ᴘᴇʀᴋꜱ
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.host';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# <a:RedCrown:1573382179298353186> 𝐃𝐑𝐄𝐀𝐌 𝐍𝐎𝐃𝐄𝐒 ┃ Server Boost Perks! 🚀
## <a:booster:1573382253332144169> ✨ Supercharge Your Gaming With Nitro Boost Rewards!

> <a:sparkles_sparkles:1573382447603785928> **Support Our Server & Claim Free High-Spec Cloud Nodes!** Boost Dream Nodes to help elevate our server level and immediately unlock powerful, dedicated gaming servers with zero subscription fees!`;

const sectionTiers =
`### <a:booster:1573382253332144169> 💎 Boost Reward Tiers:

> <a:booster:1573382253332144169> **TIER 1** ── **\`1 Server Boost\`** 🚀
> <:RAM:1573382492973568062> **RAM:** \`4 GB\` ┃ <:cpu:1573382485310709781> **CPU:** \`150%\` ┃ <:disk:1573382500795818114> **Disk:** \`10 GB NVMe\`
> 
> <a:booster:1573382253332144169> **TIER 2** ── **\`2 Server Boosts\`** 👑
> <:RAM:1573382492973568062> **RAM:** \`8 GB\` ┃ <:cpu:1573382485310709781> **CPU:** \`300%\` ┃ <:disk:1573382500795818114> **Disk:** \`20 GB NVMe\``;

const sectionPerks =
`### <a:supporter:1573382462837489828> 🌟 Exclusive VIP Booster Privileges:
> ✦ **Special Booster Role:** Exclusive role and distinct pink color highlight in member lists.
> ✦ **Priority Support Queue:** Fast-track responses from support staff for tickets.
> ✦ **Early Access:** First to test new server locations, nodes, and experimental features.
> ✦ **Enhanced Chat Permissions:** Post links and custom external stickers freely.`;

const sectionTos =
`### <a:info:1573382351214354483> Terms & Conditions:
> <a:Tick5:1573382205395177532> **Boost Validity:** Plans remain active 24/7 while your Nitro boost remains active on the server.
> <a:Tick5:1573382205395177532> **Service Notice:** Free reward tiers carry best-effort hosting (no guarantee of uptime or data).
> <a:Rocket:1573382186546102347> **Data Safety:** Take daily backups of your server worlds and configs for safety.
> 
> <a:sparkles_sparkles:1573382447603785928> **By claiming rewards, you accept our TOS.** <a:sparkles_sparkles:1573382447603785928>`;

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
              emoji: { name: '💎' }
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
              label: 'How To Buy / FAQ',
              url: howToBuyUrl,
              emoji: { name: '📖' }
            }
          ]
        },
        {
          type: 10,
          content: '-# 🚀 Dream Nodes Community Perks • Thank You For Supporting Our Server!'
        }
      ]
    }
  ]
};

async function postBoostPerks() {
  console.log('Posting Boost Perks V2 Container to channel', channelId);
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
    console.log('✓ Successfully posted Boost Perks embed! Message ID:', data.id);
    
    // Add booster reactions
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${data.id}/reactions/%F0%9F%92%8E/@me`, { // 💎
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${data.id}/reactions/%E2%9C%A8/@me`, { // ✨
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
  } else {
    console.error('✗ Failed to post:', JSON.stringify(data, null, 2));
  }
}

postBoostPerks();
