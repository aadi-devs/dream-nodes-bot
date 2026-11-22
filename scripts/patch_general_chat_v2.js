require('dotenv').config();
const { E, B } = require('../src/emojis');

const channelId = '1574120435828662512';
const messageId = '1574121499650949262';

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
            `# ${E.chat} **DREAM NODES ┃ Community Lounge**\n` +
            `### ${E.sparkles} Welcome to the Official Community Hangout & General Chat\n\n` +
            `> ${E.starRotating} Welcome to Dream Nodes! This channel is our central lounge for general discussions, gaming, tech talk, server setups, and hanging out with fellow server owners and developers.`
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content:
            `### ${E.rulesBook} **Community Lounge Guidelines:**\n` +
            `> ${E.arrowBlue} **Friendly & Respectful:** Treat everyone with kindness and mutual respect.\n` +
            `> ${E.arrowBlue} **No Unsolicited Advertising:** Please do not DM members or post external server invites.\n` +
            `> ${E.arrowBlue} **Need Official Assistance?** Open a ticket in <#1573281601775870043> for 24/7 client support.\n` +
            `> ${E.arrowBlue} **Client Reviews:** Share your experience with us in <#1574120437938520187>!\n\n` +
            `*Say hello and let us know what amazing projects you are hosting!*`
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
              label: 'Client Panel',
              url: 'https://panel.dreamnodes.cloud',
              emoji: B.hostinger
            },
            {
              type: 2,
              style: 5,
              label: 'Support Desk',
              url: 'https://discord.com/channels/1573272872737181696/1573281601775870043',
              emoji: B.ticket
            },
            {
              type: 2,
              style: 5,
              label: 'Customer Reviews',
              url: 'https://discord.com/channels/1573272872737181696/1574120437938520187',
              emoji: B.star
            }
          ]
        },
        {
          type: 10,
          content: `-# ${E.sparkles} Dream Nodes • 24/7 Community & Cloud Hosting Solutions`
        }
      ]
    }
  ]
};

async function main() {
  const token = process.env.DISCORD_TOKEN;
  console.log('Patching General Chat message', messageId, 'to Components V2...');
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
    console.log('Successfully updated General Chat to Components V2! Message ID:', data.id);
  } else {
    console.error('Failed to update General Chat:', JSON.stringify(data, null, 2));
  }
}

main().catch(console.error);
