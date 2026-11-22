const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();

// Target channel: # ♘・ᴏꜰꜰᴇʀꜱ (under ✦----- MC PLANS -----✦)
const offersChannelId = '1573281500290359338';
const clientRoleId = '1573412778620747886'; // ⋆｡°✩ ƈʅιҽɳƚ ✩°｡⋆
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';
const websiteUrl = 'https://dreamnodes.com';

const markdownContent = 
`# <:Offer:1574086348825174079> **INTEL INDIA MINECRAFT SERVER OFFER** <a:sparkles_sparkles:1573382447603785928>

╭・🇮🇳 **Dream Nodes India Minecraft Offer**
╰┈➤ <a:Lightning:1573382171257737317> Minecraft Server Offer

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<a:RedCrown:1573382179298353186> **INTEL IND PLAN - 1**
> <:ateex_processor:1574082606159364116> **Processor:** Intel Xeon E5-2690 v2
> <:RAM:1573382492973568062> **Memory:** 16GB
> <:cpu:1573382485310709781> **CPU Power:** 400%
> <:disk:1573382500795818114> **Storage:** 50GB NVMe SSD
> <a:location:1573382361574277130> **Location:** India 🇮🇳

<:money:1574082659775160447> **Offer Price: ₹160/ month** (Same at Renewal)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<a:RedCrown:1573382179298353186> **INTEL IND PLAN - 2**
> <:ateex_processor:1574082606159364116> **Processor:** Intel Xeon E5-2690 v2
> <:RAM:1573382492973568062> **Memory:** 32GB
> <:cpu:1573382485310709781> **CPU Power:** 800%
> <:disk:1573382500795818114> **Storage:** 100GB NVMe SSD
> <a:location:1573382361574277130> **Location:** India 🇮🇳

<:money:1574082659775160447> **Offer Price: ₹300/ month** (Same at Renewal)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<a:Tick5:1573382205395177532> High Performance NVMe SSD Storage
<a:Tick5:1573382205395177532> Advanced DDoS Protection
<a:Tick5:1573382205395177532> Full Panel Access
<a:Tick5:1573382205395177532> 24/7 Support

**<a:Tick5:1573382205395177532> Free Domain included from Limited Domains on Website**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<a:b_fire:1573381944702533732> Perfect for Survival, SMPs, Smaller Networks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📩 **Open a Ticket to Purchase** ||<@&${clientRoleId}>||
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
          type: 1, // Action Row with Buttons
          components: [
            {
              type: 2,
              style: 5,
              label: 'Open a Ticket',
              url: ticketChannelUrl,
              emoji: { name: '🎫' }
            },
            {
              type: 2,
              style: 5,
              label: 'How To Buy',
              url: howToBuyUrl,
              emoji: { name: '📖' }
            },
            {
              type: 2,
              style: 5,
              label: 'Official Website',
              url: websiteUrl,
              emoji: { name: '🌐' }
            }
          ]
        },
        {
          type: 10,
          content: '-# 💙 Dream Nodes • High-Performance Cloud Minecraft Server Infrastructure'
        }
      ]
    }
  ]
};

async function updateOffers() {
  console.log('Updating Intel India Minecraft Server Offer in # ♘・ᴏꜰꜰᴇʀꜱ:', offersChannelId);

  // Check existing message in channel
  const getRes = await fetch(`https://discord.com/api/v10/channels/${offersChannelId}/messages?limit=5`, {
    headers: { Authorization: `Bot ${token}` }
  });
  const msgs = await getRes.json();
  if (Array.isArray(msgs) && msgs.length > 0) {
    const msgId = msgs[0].id;
    console.log('Editing existing offer message in place:', msgId);
    const patchRes = await fetch(`https://discord.com/api/v10/channels/${offersChannelId}/messages/${msgId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(v2Payload)
    });
    const patchData = await patchRes.json();
    if (patchData.id) {
      console.log('✓ Successfully updated price to ₹160 and ₹300! Message ID:', patchData.id);
      return;
    }
  }

  // If no message found, post fresh
  const res = await fetch(`https://discord.com/api/v10/channels/${offersChannelId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(v2Payload)
  });

  const data = await res.json();
  if (data.id) {
    console.log('✓ Successfully posted updated offer to Offers! Message ID:', data.id);
  }
}

updateOffers();
