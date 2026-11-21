const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573712408554377336'; // # ♘・ʙᴜᴅɢᴇᴛ-ᴘʟᴀɴꜱ
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.com';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# <a:b_fire:1573381944702533732> Dream Nodes | Budget Minecraft Plans
## <a:hostinger:1573382335355691089> Maximum Resources • Pocket-Friendly Pricing

> <a:sparkles_sparkles:1573382447603785928> High-memory, multi-thread budget game servers tailored for creators, test networks, and communities seeking massive RAM and NVMe storage at the lowest entry cost.

### <a:fsk_warning:1573382318364692703> ⚠️ Important Budget Node Disclosures:
> ✦ **Basic DDoS Protection:** Includes standard Layer 4 mitigation only.
> ✦ **Weekly Dynamic IP:** Node IPs rotate periodically; clients must update domain DNS / IP weekly.
> ✦ **Weekly Maintenance Window:** Includes a scheduled **30-minute weekly downtime** for node maintenance.
> *(For static IPs, zero weekly downtime, and 1.2+ Tbps Game Anti-DDoS, check <#1573281486822445128>!)*`;

const sectionPro =
`### <a:Lightning:1573382171257737317> Pro Tier Plans

> ⚡ **Pro Start** \`[ 8 GB ]\`
> ✦ <:RAM:1573382492973568062> \`8 GB\` ┃ <:cpu:1573382485310709781> \`400%\` ┃ <:disk:1573382500795818114> \`150 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps\` ┃ <a:cash:1573382269735805008> \`₹350 /mo\`
> 
> ⚡ **Pro Advance** \`[ 12 GB ]\`
> ✦ <:RAM:1573382492973568062> \`12 GB\` ┃ <:cpu:1573382485310709781> \`500%\` ┃ <:disk:1573382500795818114> \`200 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps\` ┃ <a:cash:1573382269735805008> \`₹449 /mo\`
> 
> ⚡ **Pro Plus** \`[ 16 GB ]\`
> ✦ <:RAM:1573382492973568062> \`16 GB\` ┃ <:cpu:1573382485310709781> \`600%\` ┃ <:disk:1573382500795818114> \`250 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`2 Gbps\` ┃ <a:cash:1573382269735805008> \`₹529 /mo\``;

const sectionElite =
`### <a:sparkles_sparkles:1573382447603785928> Elite Tier Plans

> 💎 **Elite** \`[ 24 GB ]\`
> ✦ <:RAM:1573382492973568062> \`24 GB\` ┃ <:cpu:1573382485310709781> \`700%\` ┃ <:disk:1573382500795818114> \`350 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`2 Gbps\` ┃ <a:cash:1573382269735805008> \`₹699 /mo\`
> 
> 💎 **Elite Plus** \`[ 32 GB ]\`
> ✦ <:RAM:1573382492973568062> \`32 GB\` ┃ <:cpu:1573382485310709781> \`800%\` ┃ <:disk:1573382500795818114> \`500 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`5 Gbps\` ┃ <a:cash:1573382269735805008> \`₹879 /mo\``;

const sectionEnterprise =
`### <a:RedCrown:1573382179298353186> Enterprise Tier Plans

> 👑 **Enterprise** \`[ 48 GB ]\`
> ✦ <:RAM:1573382492973568062> \`48 GB\` ┃ <:cpu:1573382485310709781> \`1200%\` ┃ <:disk:1573382500795818114> \`750 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`5 Gbps\` ┃ <a:cash:1573382269735805008> \`₹1,149 /mo\`
> 
> 👑 **Enterprise Plus** \`[ 64 GB ]\`
> ✦ <:RAM:1573382492973568062> \`64 GB\` ┃ <:cpu:1573382485310709781> \`1600%\` ┃ <:disk:1573382500795818114> \`1 TB NVMe\` ┃ <:bandwith55:1573382523201912842> \`5 Gbps\` ┃ <a:cash:1573382269735805008> \`₹1,399 /mo\``;

const sectionTitan =
`### <a:Rocket:1573382186546102347> Titan Colossus Plans

> 🪐 **Titan** \`[ 128 GB ]\`
> ✦ <:RAM:1573382492973568062> \`128 GB\` ┃ <:cpu:1573382485310709781> \`3200%\` ┃ <:disk:1573382500795818114> \`2 TB NVMe\` ┃ <:bandwith55:1573382523201912842> \`10 Gbps\` ┃ <a:cash:1573382269735805008> \`₹2,299 /mo\`
> 
> 🪐 **Titan Max** \`[ 256 GB ]\`
> ✦ <:RAM:1573382492973568062> \`256 GB\` ┃ <:cpu:1573382485310709781> \`6400%\` ┃ <:disk:1573382500795818114> \`4 TB NVMe\` ┃ <:bandwith55:1573382523201912842> \`10 Gbps\` ┃ <a:cash:1573382269735805008> \`₹4,399 /mo\``;

const sectionFooter =
`### <a:settings:1573382421611806763> Node Features Included:
> <a:Tick5:1573382205395177532> **Pterodactyl Panel Access** (Full Root File Access, SFTP, Split Ports)
> 🗄️ **Unlimited MySQL Databases** ┃ <:backup:1573382515341664270> **Automated Backups**
> <a:hostinger:1573382335355691089> **Instant Provisioning Upon Ticket Confirmation**`;

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
          content: sectionPro
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionElite
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionEnterprise
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionTitan
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
              label: 'Open Ticket to Order',
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
          content: '-# 💙 Dream Nodes • High-Resource Budget Minecraft Hosting'
        }
      ]
    }
  ]
};

async function postBudgetPlans() {
  console.log('Posting Budget Plans V2 Container to channel', channelId);
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
    console.log('✓ Successfully posted Budget Plans embed! Message ID:', data.id);
    
    // Add reaction
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${data.id}/reactions/%E2%9D%A4%EF%B8%8F/@me`, {
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
  } else {
    console.error('✗ Failed to post:', JSON.stringify(data, null, 2));
  }
}

postBudgetPlans();
