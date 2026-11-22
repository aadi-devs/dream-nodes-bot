const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();

// Target channel: # ♘・ᴏꜰꜰᴇʀꜱ (under ✦----- MC PLANS -----✦)
const offersChannelId = '1573281500290359338';
const messageId = '1574087340283138239';
const clientRoleId = '1573412778620747886'; // ⋆｡°✩ ƈʅιҽɳƚ ✩°｡⋆
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';
const websiteUrl = 'https://dreamnodes.cloud';

const markdownContent = 
`# ${E.offer} **INTEL INDIA MINECRAFT SERVER OFFER** ${E.sparkles}

> ${E.location} **Dream Nodes India Minecraft Offer** ${E.india}
> ${E.arrowBlue} ${E.lightning} **Special High-Performance Game Node Promotion**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${E.crownRed} **INTEL IND PLAN - 1**
> ${E.processor} **Processor:** Intel Xeon E5-2690 v2
> ${E.ram} **Memory:** 16GB RAM
> ${E.cpu} **CPU Power:** 400%
> ${E.disk} **Storage:** 50GB NVMe SSD
> ${E.location} **Location:** India ${E.india}

${E.cash} **Offer Price: ₹160 / month** *(Same Price at Renewal)*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${E.crownRed} **INTEL IND PLAN - 2**
> ${E.processor} **Processor:** Intel Xeon E5-2690 v2
> ${E.ram} **Memory:** 32GB RAM
> ${E.cpu} **CPU Power:** 800%
> ${E.disk} **Storage:** 100GB NVMe SSD
> ${E.location} **Location:** India ${E.india}

${E.cash} **Offer Price: ₹300 / month** *(Same Price at Renewal)*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${E.tick5} **High Performance NVMe SSD Storage**
${E.tick5} **Advanced DDoS Protection Included**
${E.tick5} **Full Pterodactyl Control Panel Access**
${E.tick5} **24/7 Dedicated Support**

**${E.starRotating} Free Domain included from Limited Domains on Website!**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${E.fireBlue} **Perfect for Survival, SMPs & Creator Networks!**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${E.ticket} **Open a Ticket to Purchase** ||<@&${clientRoleId}>||
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
              label: 'Claim Offer / Open Ticket',
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
          content: `-# ${E.verifiedBlue} Dream Nodes • Intel India Minecraft Server Limited Offer`
        }
      ]
    }
  ]
};

async function updateMcIndiaOffer() {
  console.log('Patching Minecraft India Offer embed in channel', offersChannelId);
  const patchRes = await fetch(`https://discord.com/api/v10/channels/${offersChannelId}/messages/${messageId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(v2Payload)
  });
  const patchData = await patchRes.json();
  if (patchData.id) {
    console.log('✓ Successfully updated Minecraft India Offer embed! Message ID:', patchData.id);
  } else {
    console.error('✗ Failed to patch Minecraft India Offer:', JSON.stringify(patchData, null, 2));
  }
}

if (require.main === module) {
  updateMcIndiaOffer();
}

module.exports = { updateMcIndiaOffer, v2Payload };
