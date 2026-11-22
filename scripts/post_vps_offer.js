const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();

// Target channel: # ♘・ᴀᴜᴄᴛɪᴏɴꜱ (under ✦----- VPS PLANS -----✦)
const auctionsChannelId = '1573281528031481967';
const messageId = '1574087291578613771';
const clientRoleId = '1573412778620747886'; // ⋆｡°✩ ƈʅιҽɳƚ ✩°｡⋆
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';
const websiteUrl = 'https://dreamnodes.cloud';

const markdownContent = 
`# ${E.announce} **INTEL PLATINUM VPS OFFER • DREAM NODES** ${E.sparkles}

> ${E.vps} **Dream Nodes • Intel Platinum 8269-CY**
> ${E.arrowBlue} ${E.lightning} **High Performance Enterprise VPS** ${E.india}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ${E.ram} **32GB VPS Plan**
> ${E.processor} **Processor:** Intel Platinum 8269-CY
> ${E.ram} **Memory:** 32GB Dedicated RAM
> ${E.cpu} **CPU:** 8 Dedicated Cores
> ${E.disk} **Storage:** 150GB NVMe SSD
> ${E.location} **Location:** Mumbai, India ${E.india}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${E.cash} **Offer Price: ₹999 / month**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ${E.ram} **64GB VPS Plan**
> ${E.processor} **Processor:** Intel Platinum 8269-CY
> ${E.ram} **Memory:** 64GB Dedicated RAM
> ${E.cpu} **CPU:** 12 Dedicated Cores
> ${E.disk} **Storage:** 250GB NVMe SSD
> ${E.location} **Location:** Mumbai, India ${E.india}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${E.cash} **Offer Price: ₹1,699 / month**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ${E.settings} **Included Features:**
${E.tick5} **DDoS Protection Included • Dedicated Enterprise IPv4**
${E.tick5} **Root Access • Full Control Panel**
${E.tick5} **Instant Deployment • 24/7 Dedicated Support**

${E.ticket} **Open a Ticket to Purchase!** ||<@&${clientRoleId}>||
${ticketChannelUrl}`;

const v2Payload = {
  flags: 32768, // IS_COMPONENTS_V2
  components: [
    {
      type: 17, // Borderless Container
      components: [
        {
          type: 10,
          content: markdownContent
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
              label: 'Claim Auction / Open Ticket',
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
          content: `-# ${E.verifiedBlue} Dream Nodes • Intel Platinum 8269-CY VPS Auction Offer`
        }
      ]
    }
  ]
};

async function updateVpsOffer() {
  console.log('Patching VPS Auction Offer embed in channel', auctionsChannelId);
  const patchRes = await fetch(`https://discord.com/api/v10/channels/${auctionsChannelId}/messages/${messageId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(v2Payload)
  });
  const patchData = await patchRes.json();
  if (patchData.id) {
    console.log('✓ Successfully updated VPS Auction Offer embed! Message ID:', patchData.id);
  } else {
    console.error('✗ Failed to patch VPS Auction Offer:', JSON.stringify(patchData, null, 2));
  }
}

if (require.main === module) {
  updateVpsOffer();
}

module.exports = { updateVpsOffer, v2Payload };
