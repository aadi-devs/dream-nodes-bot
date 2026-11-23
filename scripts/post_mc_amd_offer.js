const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { E, B } = require('../src/emojis');

const targetChannelId = '1573281500290359338'; // ♘・ᴏꜰꜰᴇʀꜱ
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';
const websiteUrl = 'https://dreamnodes.cloud';

// Exact Dream Nodes emojis
const emojiOffer = '<:offer:1574106099802706050>';
const emojiAmd = '<:amd:1574105373730930958>';
const emojiProcessor = '<:ateex_processor:1574105420988158074>';
const emojiRam = '<:ram:1574106246213144767>';
const emojiCpu = '<:cpu:1574105618418114823>';
const emojiDisk = '<:disk:1574105696948195479>';

const offerMarkdown =
`# ${emojiOffer} **AMD EPYC 9 INDIA MINECRAFT SERVER OFFER** ${E.sparkles}

> ${emojiAmd} **Dream Nodes • India Minecraft Offer** ${E.india}
> ${E.arrowBlue} ${E.lightning} **Next-Gen AMD EPYC 9965 Performance**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${E.crownRed} **AMD 9 IND PLAN - 1**
> ${emojiProcessor} **Processor:** AMD EPYC 9965
> ${emojiRam} **Memory:** 4GB Dedicated RAM
> ${emojiCpu} **CPU Power:** 200%
> ${emojiDisk} **Storage:** 20GB NVMe SSD
> ${E.location} **Location:** Mumbai, India ${E.india}

${E.cash} ~~Regular Price: ₹340 / month~~
${E.cash} **Offer Price: ₹220 / month** *(Same at Renewal)*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${E.crownRed} **AMD 9 IND PLAN - 2**
> ${emojiProcessor} **Processor:** AMD EPYC 9965
> ${emojiRam} **Memory:** 8GB Dedicated RAM
> ${emojiCpu} **CPU Power:** 300%
> ${emojiDisk} **Storage:** 40GB NVMe SSD
> ${E.location} **Location:** Mumbai, India ${E.india}

${E.cash} ~~Regular Price: ₹590 / month~~
${E.cash} **Offer Price: ₹390 / month** *(Same at Renewal)*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${E.tick5} **Ultra High Performance Gen4 NVMe SSD Storage**
${E.tick5} **Dream Shield Enterprise DDoS Protection**
${E.tick5} **Full Pterodactyl Control Panel Access**
${E.tick5} **Instant Deployment • 24/7 Dedicated Support**

**${E.starRotating} Free Domain included from Limited Domains on Website!**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${E.fireBlue} **Perfect for Survival, SMPs, Lifesteal, Factions, Bigger Networks & Modded Minecraft Servers!**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${E.ticket} **Open a Ticket to Purchase** ||@everyone||
${ticketChannelUrl}`;

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
          content: `-# ${E.verifiedBlue} Dream Nodes • AMD EPYC 9965 India Minecraft Server Limited Promotion`
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

  console.log('Sending AMD EPYC Minecraft Offer to channel:', targetChannelId);
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
    console.log('SUCCESS! Sent AMD EPYC Minecraft offer message ID:', data.id);
  } else {
    console.error('ERROR sending offer:', res.status, data);
  }
}

main().catch(console.error);
