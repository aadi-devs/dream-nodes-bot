const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281579092938793'; // # ➤・ɪɴᴠɪᴛᴇ-ᴘᴇʀᴋꜱ
const messageId = '1573744287676375172';
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const inviteUrl = 'https://discord.gg/qKqw393g4E';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# ${E.gift} DREAM NODES ┃ Invite Rewards & Free Perks!
## ${E.sparkles} Invite Friends & Unlock 100% Free Game Servers!

> ${E.starRotating} **Level Up & Earn Rewards!** Share Dream Nodes with your friends and communities to claim completely free, fully featured game servers! No payment needed — just invite and play!`;

const sectionTiers =
`### ${E.gift2} Available Free Server Reward Tiers:

> ${E.arrowBlue} **TIER 1** ── **\`10 Invites\`**
> ${E.ram} **RAM:** \`2 GB\` ┃ ${E.cpu} **CPU:** \`100%\` ┃ ${E.disk} **Disk:** \`5 GB\`
> 
> ${E.arrowBlue} **TIER 2** ── **\`15 Invites\`**
> ${E.ram} **RAM:** \`4 GB\` ┃ ${E.cpu} **CPU:** \`150%\` ┃ ${E.disk} **Disk:** \`10 GB\`
> 
> ${E.arrowBlue} **TIER 3** ── **\`20 Invites\`**
> ${E.ram} **RAM:** \`6 GB\` ┃ ${E.cpu} **CPU:** \`200%\` ┃ ${E.disk} **Disk:** \`15 GB\`
> 
> ${E.arrowBlue} **TIER 4** ── **\`25 Invites\`**
> ${E.ram} **RAM:** \`8 GB\` ┃ ${E.cpu} **CPU:** \`250%\` ┃ ${E.disk} **Disk:** \`20 GB\`
> 
> ${E.arrowBlue} **TIER 5** ── **\`30 Invites\`**
> ${E.ram} **RAM:** \`10 GB\` ┃ ${E.cpu} **CPU:** \`250%\` ┃ ${E.disk} **Disk:** \`25 GB\`
> 
> ${E.arrowBlue} **TIER 6** ── **\`35 Invites\`**
> ${E.ram} **RAM:** \`12 GB\` ┃ ${E.cpu} **CPU:** \`300%\` ┃ ${E.disk} **Disk:** \`30 GB\``;

const sectionHowToClaim =
`### ${E.crownRed} How To Claim Your Free Server:
> ${E.arrowRight} Generate your permanent server invite link to **Dream Nodes** (\`discord.gg/qKqw393g4E\`).
> ${E.arrowRight} Invite your gamer friends, streamers, and Discord communities!
> ${E.arrowRight} Reach your desired milestone and open a ticket to deploy your free server instantly!`;

const sectionTos =
`### ${E.info} Terms & Conditions:
> ${E.tick5} **Monthly Renewal:** Plans are renewed monthly based on maintaining active invites.
> ${E.tick5} **Service Notice:** Free reward tiers carry best-effort hosting (no guarantee of uptime or data).
> ${E.rocket} **Data Safety:** Take daily backups of your server worlds and configs for safety.
> 
> ${E.sparkles} **By claiming rewards, you accept and agree to our TOS.**`;

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
              emoji: B.gift
            },
            {
              type: 2,
              style: 5,
              label: 'Server Invite Link',
              url: inviteUrl,
              emoji: B.link
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
          content: `-# ${E.verifiedBlue} Dream Nodes Community Perks • Free High-Speed Game Servers for Everyone!`
        }
      ]
    }
  ]
};

async function updateInvitePerks() {
  console.log('Patching Invite Perks embed in channel', channelId);
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
    console.log('✓ Successfully updated Invite Perks embed! Message ID:', patchData.id);
  } else {
    console.error('✗ Failed to patch Invite Perks:', JSON.stringify(patchData, null, 2));
  }
}

if (require.main === module) {
  updateInvitePerks();
}

module.exports = { updateInvitePerks, v2Payload };
