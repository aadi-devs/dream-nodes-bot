const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281579092938793'; // # ➤・ɪɴᴠɪᴛᴇ-ᴘᴇʀᴋꜱ
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const inviteUrl = 'https://discord.gg/qKqw393g4E';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# <a:Gift:1573382163993329774> 𝐃𝐑𝐄𝐀𝐌 𝐍𝐎𝐃𝐄𝐒 ┃ Invite Rewards & Free Perks! 🎉
## <a:sparkles_sparkles:1573382447603785928> 🎈 Invite Friends & Unlock 100% Free Game Servers! 🥳

> <a:Rotating_Star:1573382194020491317> **Level Up & Earn Rewards!** Share Dream Nodes with your friends and communities to claim completely free, fully featured game servers! No payment needed — just invite and play! 🎁✨`;

const sectionTiers =
`### <a:gj_gift_box:1573382327906865152> 🎁 Available Free Server Reward Tiers:

> <a:arrowf:1573382243827585114> **TIER 1** ── **\`10 Invites\`** 🎉
> <:RAM:1573382492973568062> **RAM:** \`2 GB\` ┃ <:cpu:1573382485310709781> **CPU:** \`100%\` ┃ <:disk:1573382500795818114> **Disk:** \`5 GB\`
> 
> <a:Arrow_White:1573382131026108678> **TIER 2** ── **\`15 Invites\`** 🎈
> <:RAM:1573382492973568062> **RAM:** \`4 GB\` ┃ <:cpu:1573382485310709781> **CPU:** \`150%\` ┃ <:disk:1573382500795818114> **Disk:** \`10 GB\`
> 
> <a:arrowf:1573382243827585114> **TIER 3** ── **\`20 Invites\`** ⚡
> <:RAM:1573382492973568062> **RAM:** \`6 GB\` ┃ <:cpu:1573382485310709781> **CPU:** \`200%\` ┃ <:disk:1573382500795818114> **Disk:** \`15 GB\`
> 
> <a:Arrow_White:1573382131026108678> **TIER 4** ── **\`25 Invites\`** 🔥
> <:RAM:1573382492973568062> **RAM:** \`8 GB\` ┃ <:cpu:1573382485310709781> **CPU:** \`250%\` ┃ <:disk:1573382500795818114> **Disk:** \`20 GB\`
> 
> <a:arrowf:1573382243827585114> **TIER 5** ── **\`30 Invites\`** 🚀
> <:RAM:1573382492973568062> **RAM:** \`10 GB\` ┃ <:cpu:1573382485310709781> **CPU:** \`250%\` ┃ <:disk:1573382500795818114> **Disk:** \`25 GB\`
> 
> <a:Arrow_White:1573382131026108678> **TIER 6** ── **\`35 Invites\`** 👑
> <:RAM:1573382492973568062> **RAM:** \`12 GB\` ┃ <:cpu:1573382485310709781> **CPU:** \`300%\` ┃ <:disk:1573382500795818114> **Disk:** \`30 GB\``;

const sectionHowToClaim =
`### <a:RedCrown:1573382179298353186> 🌟 How To Claim Your Free Server:
> 1️⃣ Generate your permanent server invite link to **Dream Nodes** (\`discord.gg/qKqw393g4E\`).
> 2️⃣ Invite your gamer friends, streamers, and Discord communities!
> 3️⃣ Reach your desired milestone and open a ticket to deploy your free server instantly! 🚀`;

const sectionTos =
`### <a:info:1573382351214354483> Terms & Conditions:
> <a:Tick5:1573382205395177532> **Monthly Renewal:** Plans are renewed monthly based on maintaining active invites.
> <a:Tick5:1573382205395177532> **Service Notice:** Free reward tiers carry best-effort hosting (no guarantee of uptime or data).
> <a:Rocket:1573382186546102347> **Data Safety:** Take daily backups of your server worlds and configs for safety.
> 
> <a:sparkles_sparkles:1573382447603785928> **By claiming rewards, you accept and agree to our TOS.** <a:sparkles_sparkles:1573382447603785928>`;

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
          content: sectionHowToClaim
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
              label: 'Claim Reward / Open Ticket',
              url: ticketChannelUrl,
              emoji: { name: '🎁' }
            },
            {
              type: 2,
              style: 5,
              label: 'Server Invite Link',
              url: inviteUrl,
              emoji: { name: '🔗' }
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
          content: '-# 🎉 Dream Nodes Community Perks • Free High-Speed Game Servers for Everyone!'
        }
      ]
    }
  ]
};

async function postInvitePerks() {
  console.log('Posting Invite Perks V2 Container to channel', channelId);
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
    console.log('✓ Successfully posted Invite Perks embed! Message ID:', data.id);
    
    // Add celebratory reactions
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${data.id}/reactions/%F0%9F%8E%89/@me`, { // 🎉
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${data.id}/reactions/%F0%9F%8E%81/@me`, { // 🎁
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
  } else {
    console.error('✗ Failed to post:', JSON.stringify(data, null, 2));
  }
}

postInvitePerks();
