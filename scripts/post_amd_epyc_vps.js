const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281514165248091'; // # ♘・ᴀᴍᴅ-ᴇᴘʏᴄ-ᴠᴘꜱ
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.host';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# <:vps:1573382507863220246> 𝐃𝐑𝐄𝐀𝐌 𝐍𝐎𝐃𝐄𝐒 ┃ AMD EPYC™ VPS
## <a:location:1573382361574277130> 🇮🇳 India Datacenter • Next-Gen Multi-Thread Compute • Pure Gen4 NVMe

> <a:Attacks:1573382140006244363> **Tier-IV Enterprise Indian Datacenter Nodes:** Engineered for maximum throughput, heavy multi-threading, bot swarms, game networks, and high-concurrency microservices.`;

const sectionSmall =
`### <a:b_fire:1573381944702533732> Starter & Development Nodes

> 🔸 **PLAN-B** ── <a:cash:1573382269735805008> **\`₹549 /mo\`**
> <:cpu:1573382485310709781> \`1 AMD EPYC™ vCore\` ┃ <:RAM:1573382492973568062> \`6 GB RAM\`
> <:disk:1573382500795818114> \`40 GB Gen4 NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\`
> 
> 🔸 **PLAN-C** ── <a:cash:1573382269735805008> **\`₹699 /mo\`**
> <:cpu:1573382485310709781> \`2 AMD EPYC™ vCores\` ┃ <:RAM:1573382492973568062> \`8 GB RAM\`
> <:disk:1573382500795818114> \`60 GB Gen4 NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\`
> 
> 🔸 **PLAN-D** ── <a:cash:1573382269735805008> **\`₹949 /mo\`**
> <:cpu:1573382485310709781> \`3 AMD EPYC™ vCores\` ┃ <:RAM:1573382492973568062> \`12 GB RAM\`
> <:disk:1573382500795818114> \`80 GB Gen4 NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\``;

const sectionBig =
`### <a:Lightning:1573382171257737317> Production & High-Load Nodes

> ⚡ **PLAN-E** ── <a:cash:1573382269735805008> **\`₹1,299 /mo\`**
> <:cpu:1573382485310709781> \`4 AMD EPYC™ vCores\` ┃ <:RAM:1573382492973568062> \`16 GB RAM\`
> <:disk:1573382500795818114> \`100 GB Gen4 NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\`
> 
> ⚡ **PLAN-F** ── <a:cash:1573382269735805008> **\`₹1,599 /mo\`**
> <:cpu:1573382485310709781> \`6 AMD EPYC™ vCores\` ┃ <:RAM:1573382492973568062> \`24 GB RAM\`
> <:disk:1573382500795818114> \`120 GB Gen4 NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\`
> 
> ⚡ **PLAN-G** ── <a:cash:1573382269735805008> **\`₹1,899 /mo\`**
> <:cpu:1573382485310709781> \`8 AMD EPYC™ vCores\` ┃ <:RAM:1573382492973568062> \`32 GB RAM\`
> <:disk:1573382500795818114> \`150 GB Gen4 NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\``;

const sectionBiggest =
`### <a:RedCrown:1573382179298353186> Heavyweight Enterprise Dedicated Nodes

> 👑 **PLAN-H** ── <a:cash:1573382269735805008> **\`₹2,499 /mo\`**
> <:cpu:1573382485310709781> \`10 AMD EPYC™ vCores\` ┃ <:RAM:1573382492973568062> \`48 GB RAM\`
> <:disk:1573382500795818114> \`200 GB Gen4 NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\`
> 
> 👑 **PLAN-I** ── <a:cash:1573382269735805008> **\`₹2,999 /mo\`**
> <:cpu:1573382485310709781> \`12 AMD EPYC™ vCores\` ┃ <:RAM:1573382492973568062> \`64 GB RAM\`
> <:disk:1573382500795818114> \`250 GB Gen4 NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\``;

const sectionFooter =
`### <a:sparkles_sparkles:1573382447603785928> Enterprise VPS Specifications & Inclusions:
> 🛡️ **Multi-Tbps Anti-DDoS Mitigation:** Automated L4 & L7 real-time traffic scrubbing keeping servers online 24/7.
> 🔑 **100% Full Root & Sudo Control:** Full SSH / RDP root privileges with no limitations or lock-ins.
> <:bandwith55:1573382523201912842> **Truly Unmetered Bandwidth:** Unlimited 1 Gbps port with zero bandwidth limits or throttling.
> 🌐 **Dedicated Clean IPv4:** Every virtual machine includes a dedicated static IPv4 address.
> 🇮🇳 **Ultra-Low Latency India Routing:** Hosted in premier Indian datacenters for lowest possible latency.
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
          content: '-# ⚡ Dream Nodes • Enterprise High-Performance AMD EPYC™ Cloud VPS'
        }
      ]
    }
  ]
};

async function postAmdEpycVpsPlans() {
  console.log('Posting AMD EPYC VPS Plans V2 Container to channel', channelId);
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
    console.log('✓ Successfully posted AMD EPYC VPS Plans embed! Message ID:', data.id);
    
    // Add reaction
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${data.id}/reactions/%E2%9D%A4%EF%B8%8F/@me`, {
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
  } else {
    console.error('✗ Failed to post:', JSON.stringify(data, null, 2));
  }
}

postAmdEpycVpsPlans();
