const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { E, B } = require('../src/emojis');

const targetChannelId = '1573281528031481967'; // ♘・ᴀᴜᴄᴛɪᴏɴꜱ
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';
const websiteUrl = 'https://dreamnodes.cloud';

// Exact Dream Nodes emojis from bot_emojis.json
const emojiAmd = '<:amd:1574105373730930958>';
const emojiProcessor = '<:ateex_processor:1574105420988158074>';
const emojiRam = '<:ram:1574106246213144767>';
const emojiCpu = '<:cpu:1574105618418114823>';
const emojiDisk = '<:disk:1574105696948195479>';

const offerMarkdown =
`# ${E.announce} **AMD VPS OFFER • DREAM NODES** ${E.sparkles}\n\n` +
`> ${emojiAmd} **Dream Nodes • AMD EPYC 7573X**\n` +
`> ${E.arrowBlue} ${E.lightning} **High Performance Enterprise VPS** ${E.india}\n\n` +
`━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
`## ${emojiRam} **16GB VPS Plan**\n` +
`> ${emojiProcessor} **Processor:** AMD EPYC 7573X\n` +
`> ${emojiRam} **Memory:** 16GB Dedicated RAM\n` +
`> ${emojiCpu} **CPU:** 4 Dedicated Cores\n` +
`> ${emojiDisk} **Storage:** 70GB NVMe SSD\n` +
`> ${E.location} **Location:** Delhi, India ${E.india}\n\n` +
`━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
`${E.cash} **Offer Price: ₹749 / month**\n` +
`━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
`## ${emojiRam} **32GB VPS Plan**\n` +
`> ${emojiProcessor} **Processor:** AMD EPYC 7573X\n` +
`> ${emojiRam} **Memory:** 32GB Dedicated RAM\n` +
`> ${emojiCpu} **CPU:** 8 Dedicated Cores\n` +
`> ${emojiDisk} **Storage:** 150GB NVMe SSD\n` +
`> ${E.location} **Location:** Delhi, India ${E.india}\n\n` +
`━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
`${E.cash} **Offer Price: ₹1,399 / month**\n` +
`━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
`## ${emojiRam} **64GB VPS Plan**\n` +
`> ${emojiProcessor} **Processor:** AMD EPYC 7573X\n` +
`> ${emojiRam} **Memory:** 64GB Dedicated RAM\n` +
`> ${emojiCpu} **CPU:** 12 Dedicated Cores\n` +
`> ${emojiDisk} **Storage:** 250GB NVMe SSD\n` +
`> ${E.location} **Location:** Delhi, India ${E.india}\n\n` +
`━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
`${E.cash} **Offer Price: ₹2,049 / month**\n` +
`━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
`**PRICES SAME AT RENEWAL ~ EMI OPTIONS AVAILABLE**\n\n` +
`## ${E.settings} **Included Features:**\n` +
`${E.tick5} **DDoS Protection Included • Dedicated Enterprise IPv4**\n` +
`${E.tick5} **Root Access • Full Control Panel**\n` +
`${E.tick5} **Instant Deployment • 24/7 Dedicated Support**\n\n` +
`${E.ticket} **Open a Ticket to Purchase!** ||@everyone||\n` +
`${ticketChannelUrl}`;

const payload = {
  flags: 32768, // IS_COMPONENTS_V2
  content: '',
  embeds: [],
  allowed_mentions: { parse: ['everyone', 'roles'] },
  components: [
    {
      type: 17, // Borderless Container
      accent_color: null,
      components: [
        {
          type: 10,
          content: offerMarkdown
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
              label: 'Claim Offer / Open Ticket',
              emoji: B.ticket,
              url: ticketChannelUrl
            },
            {
              type: 2,
              style: 5,
              label: 'How To Buy',
              emoji: B.info,
              url: howToBuyUrl
            },
            {
              type: 2,
              style: 5,
              label: 'Official Website',
              emoji: B.fireWorld,
              url: websiteUrl
            }
          ]
        },
        {
          type: 10,
          content: `-# ${E.verifiedBlue} Dream Nodes • AMD EPYC 7573X High Performance VPS Offer`
        }
      ]
    }
  ]
};

async function main() {
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    console.error('Missing DISCORD_TOKEN');
    process.exit(1);
  }

  console.log('Sending AMD VPS Offer to channel:', targetChannelId);
  const res = await fetch(`https://discord.com/api/v10/channels/${targetChannelId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (res.ok) {
    console.log('SUCCESS! Sent AMD VPS offer message ID:', data.id);
  } else {
    console.error('ERROR sending offer:', res.status, data);
  }
}

main().catch(console.error);
