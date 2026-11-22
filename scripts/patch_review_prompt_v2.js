require('dotenv').config();
const { E, B } = require('../src/emojis');

const channelId = '1574120437938520187'; // # ✦・ʀᴇᴠɪᴇᴡꜱ
const messageId = '1574121350958948363';
const paidClientRoleId = '1573412778620747886'; // ⋆｡°✩ ƈʅιҽɳƚ ✩°｡⋆

const v2Payload = {
  flags: 32768, // IS_COMPONENTS_V2
  embeds: [],
  components: [
    {
      type: 17, // Borderless Container
      components: [
        {
          type: 10,
          content:
            `# ${E.stars} **DREAM NODES ┃ Verified Client Reviews**\n` +
            `### ${E.starRotating} Official Customer Feedback & Testimonials Desk\n\n` +
            `> ${E.diamond} We take immense pride in delivering enterprise cloud compute, high-frequency Minecraft nodes, VPS, and bot hosting. Genuine client reviews help us continuously improve and innovate!`
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content:
            `### ${E.updates} **Review Desk Highlights:**\n` +
            `> ${E.star} **Average Community Rating:** \`5.0 / 5.0\` ★★★★★\n` +
            `> ${E.membership} **Verified Client Reviews:** Live feedback from active server owners\n` +
            `> ${E.shield} **Verified Client Protection:** Submitting reviews & voting is strictly reserved for **Paid Clients** (<@&${paidClientRoleId}>)\n\n` +
            `### ${E.gift} **How To Submit A Review:**\n` +
            `> ${E.arrowBlue} Verified clients can click **Submit A Review** below or type \`/review\`.\n` +
            `> ${E.arrowBlue} Founders & Management respond directly to every client review in the attached **Owner's Response** thread!`
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
              style: 1, // Primary / Blurple
              label: 'Submit A Review',
              custom_id: 'review_submit_btn',
              emoji: B.rulesBook
            },
            {
              type: 2,
              style: 5, // Link
              label: 'Client Panel',
              url: 'https://panel.dreamnodes.cloud',
              emoji: B.hostinger
            },
            {
              type: 2,
              style: 5, // Link
              label: 'Support Desk',
              url: 'https://discord.com/channels/1573272872737181696/1573281601775870043',
              emoji: B.ticket
            }
          ]
        },
        {
          type: 10,
          content: `-# ${E.starRotating} Dream Nodes • Verified Customer Reputation Hub`
        }
      ]
    }
  ]
};

async function main() {
  const token = process.env.DISCORD_TOKEN;
  console.log('Patching Review Hub message', messageId, 'to Components V2...');
  const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(v2Payload)
  });

  const data = await res.json();
  if (res.ok) {
    console.log('Successfully updated Review Hub to Components V2! Message ID:', data.id);
  } else {
    console.error('Failed to update Review Hub:', JSON.stringify(data, null, 2));
  }
}

main().catch(console.error);
