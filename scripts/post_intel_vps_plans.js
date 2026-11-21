const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281509140336816'; // # ♘・ɪɴᴛᴇʟ-ᴠᴘꜱ-ᴘʟᴀɴꜱ
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.com';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# <:vps:1573382507863220246> Dream Nodes | High-Performance Intel VPS
## <a:Attacks:1573382140006244363> 🚀 Dedicated Intel Compute • Gen4 NVMe • Full Root Control

> <a:Lightning:1573382171257737317> Enterprise cloud virtual private servers powered by high-frequency Intel Xeon processors and Gen4 NVMe arrays. Built for gaming networks, bot clusters, heavy APIs, and microservices.

### <a:RedCrown:1573382179298353186> Premium Server Standards:
> ✦ **100% Unmetered Bandwidth:** Truly unlimited 1 Gbps traffic with zero bandwidth caps or throttling.
> ✦ **Complete Root / Administrator Access:** Full SSH / RDP root privileges with custom OS reinstallation.
> ✦ **Enterprise Anti-DDoS Shield:** Continuous Layer 4 & Layer 7 traffic scrubbing keeping you online 24/7.
> ✦ **Dedicated Clean IPv4:** Every virtual machine includes a dedicated static IPv4 address.`;

const sectionSmall =
`### <a:b_fire:1573381944702533732> Standard Intel Compute Plans

> 🔴 **PLAN-B** \`[ 6 GB ]\` ── <a:cash:1573382269735805008> **\`₹499 /mo\`**
> ✦ <:cpu:1573382485310709781> \`1 vCore\` ┃ <:RAM:1573382492973568062> \`6 GB DDR4\` ┃ <:disk:1573382500795818114> \`40 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`Unmetered 1 Gbps\`
> 
> 🔴 **PLAN-C** \`[ 8 GB ]\` ── <a:cash:1573382269735805008> **\`₹599 /mo\`**
> ✦ <:cpu:1573382485310709781> \`2 vCores\` ┃ <:RAM:1573382492973568062> \`8 GB DDR4\` ┃ <:disk:1573382500795818114> \`60 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`Unmetered 1 Gbps\`
> 
> 🔴 **PLAN-D** \`[ 12 GB ]\` ── <a:cash:1573382269735805008> **\`₹799 /mo\`**
> ✦ <:cpu:1573382485310709781> \`3 vCores\` ┃ <:RAM:1573382492973568062> \`12 GB DDR4\` ┃ <:disk:1573382500795818114> \`80 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`Unmetered 1 Gbps\``;

const sectionBig =
`### <a:Lightning:1573382171257737317> High-Capacity Performance Plans

> 🛸 **PLAN-E** \`[ 16 GB ]\` ── <a:cash:1573382269735805008> **\`₹1,099 /mo\`**
> ✦ <:cpu:1573382485310709781> \`4 vCores\` ┃ <:RAM:1573382492973568062> \`16 GB DDR4\` ┃ <:disk:1573382500795818114> \`100 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`Unmetered 1 Gbps\`
> 
> 🛸 **PLAN-F** \`[ 24 GB ]\` ── <a:cash:1573382269735805008> **\`₹1,299 /mo\`**
> ✦ <:cpu:1573382485310709781> \`6 vCores\` ┃ <:RAM:1573382492973568062> \`24 GB DDR4\` ┃ <:disk:1573382500795818114> \`120 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`Unmetered 1 Gbps\`
> 
> 🛸 **PLAN-G** \`[ 32 GB ]\` ── <a:cash:1573382269735805008> **\`₹1,499 /mo\`**
> ✦ <:cpu:1573382485310709781> \`8 vCores\` ┃ <:RAM:1573382492973568062> \`32 GB DDR4\` ┃ <:disk:1573382500795818114> \`150 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`Unmetered 1 Gbps\``;

const sectionBiggest =
`### <a:RedCrown:1573382179298353186> Ultra Enterprise Heavyweight Plans

> 👑 **PLAN-H** \`[ 48 GB ]\` ── <a:cash:1573382269735805008> **\`₹2,099 /mo\`**
> ✦ <:cpu:1573382485310709781> \`10 vCores\` ┃ <:RAM:1573382492973568062> \`48 GB DDR4\` ┃ <:disk:1573382500795818114> \`200 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`Unmetered 1 Gbps\`
> 
> 👑 **PLAN-I** \`[ 64 GB ]\` ── <a:cash:1573382269735805008> **\`₹2,499 /mo\`**
> ✦ <:cpu:1573382485310709781> \`12 vCores\` ┃ <:RAM:1573382492973568062> \`64 GB DDR4\` ┃ <:disk:1573382500795818114> \`250 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`Unmetered 1 Gbps\``;

const sectionFooter =
`### <a:sparkles_sparkles:1573382447603785928> Core VPS Capabilities & Features:
> 🛡️ **Enterprise Anti-DDoS Mitigation:** Multi-Tbps scrubbing with Layer 4 & Layer 7 defense.
> 🔑 **100% Full Root & Sudo Control:** Complete SSH/RDP root privileges with no lock-ins.
> <:bandwith55:1573382523201912842> **Truly Unmetered Bandwidth:** Run traffic 24/7 with zero bandwidth caps or throttling.
> 💿 **OS Choices:** Ubuntu 22.04/24.04, Debian 11/12, CentOS 7/9, AlmaLinux, Windows Server.
> 🌐 **Dedicated IPv4 Address:** Clean, private dedicated IPv4 included on every VPS instance.
> 🚀 **Instant Setup:** Automated provisioning dispatched immediately upon ticket confirmation.`;

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
          content: '-# 🛸 Dream Nodes • Enterprise High-Performance Intel Cloud VPS Solutions'
        }
      ]
    }
  ]
};

async function postIntelVpsPlans() {
  console.log('Posting Intel VPS Plans V2 Container to channel', channelId);
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

postIntelVpsPlans();
