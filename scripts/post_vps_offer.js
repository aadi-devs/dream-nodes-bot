const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();

// Channels:
// 1573337308529434756: # 𖹭ᐟ・ᴀɴɴᴏᴜɴᴄᴇᴍᴇɴᴛꜱ
// 1573281500290359338: # ♘・ᴏꜰꜰᴇʀꜱ
const announcementsChannelId = '1573337308529434756';
const offersChannelId = '1573281500290359338';

const clientRoleId = '1573412778620747886'; // ⋆｡°✩ ƈʅιҽɳƚ ✩°｡⋆

const markdownContent = 
`# **INTEL PLATINUM VPS OFFER • VELTRION HOSTING**

╭・<a:announce:1573382228795457687> **Dream Nodes • Intel Platinum 8269-CY**
╰┈➤ <a:Lightning:1573382171257737317> **High Performance VPS** :flag_in:

## <:RAM:1573382492973568062> **32GB VPS Plan**
> <:ateex_processor:1574082606159364116> **Processor:** Intel Platinum 8269-CY
> <:RAM:1573382492973568062> **Memory:** 32GB Dedicated RAM
> <:cpu:1573382485310709781> **CPU:** 8 Dedicated Cores
> <:disk:1573382500795818114> **Storage:** 150GB NVMe SSD
> <a:location:1573382361574277130> **Location:** Mumbai, India :flag_in:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<:money:1574082659775160447> **Offer Price:** ₹999/month
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## <:RAM:1573382492973568062> **64GB VPS Plan**
> <:ateex_processor:1574082606159364116> **Processor:** Intel Platinum 8269-CY
> <:RAM:1573382492973568062> **Memory:** 64GB Dedicated RAM
> <:cpu:1573382485310709781> **CPU:** 12 Dedicated Cores
> <:disk:1573382500795818114> **Storage:** 250GB NVMe SSD
> <a:location:1573382361574277130> **Location:** Mumbai, India :flag_in:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<:money:1574082659775160447> **Offer Price:** ₹1699/month
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## **Included Features**
<a:Tick5:1573382205395177532> DDoS Protection Included • Dedicated Enterprise IPv4
<a:Tick5:1573382205395177532> Root Access • Control Panel
<a:Tick5:1573382205395177532> Instant Deployment • 24/7 Support

:envelope_with_arrow: **Open a Ticket to Purchase!** ||<@&${clientRoleId}>||
https://discord.com/channels/1573272872737181696/1573281601775870043`;

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
          type: 1, // Action Row with Buttons
          components: [
            {
              type: 2,
              style: 5,
              label: 'Open a Ticket',
              url: 'https://discord.com/channels/1573272872737181696/1573281601775870043',
              emoji: { name: '🎫' }
            },
            {
              type: 2,
              style: 5,
              label: 'How To Buy',
              url: 'https://discord.com/channels/1573272872737181696/1573281597464121425',
              emoji: { name: '📖' }
            },
            {
              type: 2,
              style: 5,
              label: 'Official Website',
              url: 'https://dreamnodes.com',
              emoji: { name: '🌐' }
            }
          ]
        },
        {
          type: 10,
          content: '-# 💙 Dream Nodes • High-Performance Cloud VPS & Dedicated Compute'
        }
      ]
    }
  ]
};

async function postOffer() {
  console.log('Posting Intel Platinum VPS Offer to Announcements channel:', announcementsChannelId);

  const res = await fetch(`https://discord.com/api/v10/channels/${announcementsChannelId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(v2Payload)
  });

  const data = await res.json();
  if (data.id) {
    console.log('✓ Successfully posted to Announcements! Message ID:', data.id);
  } else {
    console.error('✗ Failed to post to Announcements:', JSON.stringify(data, null, 2));
  }

  // Also post to # ♘・ᴏꜰꜰᴇʀꜱ
  console.log('Posting Intel Platinum VPS Offer to Offers channel:', offersChannelId);
  const res2 = await fetch(`https://discord.com/api/v10/channels/${offersChannelId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(v2Payload)
  });

  const data2 = await res2.json();
  if (data2.id) {
    console.log('✓ Successfully posted to Offers! Message ID:', data2.id);
  } else {
    console.error('✗ Failed to post to Offers:', JSON.stringify(data2, null, 2));
  }
}

postOffer();
