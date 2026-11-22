const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();

// Target channel: # ♘・ᴀᴜᴄᴛɪᴏɴꜱ (under ✦----- VPS PLANS -----✦)
const auctionsChannelId = '1573281528031481967';
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

async function postToAuctions() {
  console.log('Posting Intel Platinum VPS Offer to Auctions channel:', auctionsChannelId);

  const res = await fetch(`https://discord.com/api/v10/channels/${auctionsChannelId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(v2Payload)
  });

  const data = await res.json();
  if (data.id) {
    console.log('✓ Successfully posted to Auctions! Message ID:', data.id);

    // Add reactions
    await fetch(`https://discord.com/api/v10/channels/${auctionsChannelId}/messages/${data.id}/reactions/%E2%9A%A1/@me`, { // ⚡
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
    await fetch(`https://discord.com/api/v10/channels/${auctionsChannelId}/messages/${data.id}/reactions/%F0%9F%8E%AB/@me`, { // 🎫
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
    console.log('✓ Reactions added to Auctions message');
  } else {
    console.error('✗ Failed to post to Auctions:', JSON.stringify(data, null, 2));
  }
}

postToAuctions();
