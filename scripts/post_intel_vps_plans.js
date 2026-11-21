const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281509140336816'; // # ♘・ɪɴᴛᴇʟ-ᴠᴘꜱ-ᴘʟᴀɴꜱ
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.com';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# <:vps:1573382507863220246> 𝐃𝐑𝐄𝐀𝐌 𝐍𝐎𝐃𝐄𝐒 ┃ Intel Xeon VPS
## <a:Lightning:1573382171257737317> ⚡ High-Frequency Intel Compute • Pure Gen4 NVMe • Full Root Control

> <a:Attacks:1573382140006244363> **Tier-IV Enterprise Intel Cloud Nodes:** Engineered for sustained high single-core clocks, gaming networks, bot swarms, heavy APIs, and microservices.`;

const sectionSmall =
`### <a:b_fire:1573381944702533732> Starter & Development Nodes

> 🔸 **PLAN-B** ── <a:cash:1573382269735805008> **\`₹499 /mo\`**
> <:cpu:1573382485310709781> \`1 Intel vCore\` ┃ <:RAM:1573382492973568062> \`6 GB RAM\`
> <:disk:1573382500795818114> \`40 GB Gen4 NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\`
> 
> 🔸 **PLAN-C** ── <a:cash:1573382269735805008> **\`₹599 /mo\`**
> <:cpu:1573382485310709781> \`2 Intel vCores\` ┃ <:RAM:1573382492973568062> \`8 GB RAM\`
> <:disk:1573382500795818114> \`60 GB Gen4 NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\`
> 
> 🔸 **PLAN-D** ── <a:cash:1573382269735805008> **\`₹799 /mo\`**
> <:cpu:1573382485310709781> \`3 Intel vCores\` ┃ <:RAM:1573382492973568062> \`12 GB RAM\`
> <:disk:1573382500795818114> \`80 GB Gen4 NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\``;

const sectionBig =
`### <a:Lightning:1573382171257737317> Production & High-Load Nodes

> ⚡ **PLAN-E** ── <a:cash:1573382269735805008> **\`₹1,099 /mo\`**
> <:cpu:1573382485310709781> \`4 Intel vCores\` ┃ <:RAM:1573382492973568062> \`16 GB RAM\`
> <:disk:1573382500795818114> \`100 GB Gen4 NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\`
> 
> ⚡ **PLAN-F** ── <a:cash:1573382269735805008> **\`₹1,299 /mo\`**
> <:cpu:1573382485310709781> \`6 Intel vCores\` ┃ <:RAM:1573382492973568062> \`24 GB RAM\`
> <:disk:1573382500795818114> \`120 GB Gen4 NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\`
> 
> ⚡ **PLAN-G** ── <a:cash:1573382269735805008> **\`₹1,499 /mo\`**
> <:cpu:1573382485310709781> \`8 Intel vCores\` ┃ <:RAM:1573382492973568062> \`32 GB RAM\`
> <:disk:1573382500795818114> \`150 GB Gen4 NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\``;

const sectionBiggest =
`### <a:RedCrown:1573382179298353186> Heavyweight Enterprise Dedicated Nodes

> 👑 **PLAN-H** ── <a:cash:1573382269735805008> **\`₹2,099 /mo\`**
> <:cpu:1573382485310709781> \`10 Intel vCores\` ┃ <:RAM:1573382492973568062> \`48 GB RAM\`
> <:disk:1573382500795818114> \`200 GB Gen4 NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\`
> 
> 👑 **PLAN-I** ── <a:cash:1573382269735805008> **\`₹2,499 /mo\`**
> <:cpu:1573382485310709781> \`12 Intel vCores\` ┃ <:RAM:1573382492973568062> \`64 GB RAM\`
> <:disk:1573382500795818114> \`250 GB Gen4 NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\``;

const sectionFooter =
`### <a:sparkles_sparkles:1573382447603785928> Enterprise VPS Specifications & Inclusions:
> 🛡️ **Multi-Tbps Anti-DDoS Mitigation:** Automated L4 & L7 real-time traffic scrubbing keeping servers online 24/7.
> 🔑 **100% Full Root & Sudo Control:** Full SSH / RDP root privileges with no limitations or lock-ins.
> <:bandwith55:1573382523201912842> **Truly Unmetered Bandwidth:** Unlimited 1 Gbps port with zero bandwidth limits or throttling.
> 🌐 **Dedicated Clean IPv4:** Every virtual machine includes a dedicated static IPv4 address.
> 💿 **OS Choices:** Ubuntu 22.04/24.04 LTS, Debian 12, AlmaLinux, CentOS, Windows Server 2022.
> 🚀 **Instant Setup:** Automated provisioning dispatched immediately upon ticket verification.`;

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
          content: sectionSmall
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionBig
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionBiggest
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionFooter
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
              label: 'Order VPS / Open Ticket',
              url: ticketChannelUrl,
              emoji: { name: '🎫' }
            },
            {
              type: 2,
              style: 5,
              label: 'Official Website',
              url: websiteUrl,
              emoji: { name: '🌐' }
            },
            {
              type: 2,
              style: 5,
              label: 'How To Buy',
              url: howToBuyUrl,
              emoji: { name: '📖' }
            }
          ]
        },
        {
          type: 10,
          content: '-# ⚡ Dream Nodes • Enterprise High-Performance Intel Cloud VPS'
        }
      ]
    }
  ]
};

async function updateIntelVpsPlans() {
  console.log('Fetching existing messages in channel', channelId);
  const getRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages?limit=10`, {
    headers: { Authorization: `Bot ${token}` }
  });
  const msgs = await getRes.json();
  
  if (Array.isArray(msgs) && msgs.length > 0) {
    const targetMsg = msgs[0];
    console.log('Editing existing message:', targetMsg.id);
    const patchRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${targetMsg.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(v2Payload)
    });
    const patchData = await patchRes.json();
    if (patchData.id) {
      console.log('✓ Successfully updated existing Intel VPS Plans embed! Message ID:', patchData.id);
      return;
    } else {
      console.warn('Could not patch, will post new. Error:', patchData);
    }
  }

  console.log('Posting fresh Intel VPS Plans V2 Container to channel', channelId);
  const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(v2Payload)
  });

  const data = await res.json();
  if (data.id) {
    console.log('✓ Successfully posted Intel VPS Plans embed! Message ID:', data.id);
    
    // Add reaction
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${data.id}/reactions/%E2%9D%A4%EF%B8%8F/@me`, {
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
  } else {
    console.error('✗ Failed to post:', JSON.stringify(data, null, 2));
  }
}

updateIntelVpsPlans();
