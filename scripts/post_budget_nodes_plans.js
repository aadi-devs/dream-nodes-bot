const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573712408554377336'; // # ♘・ʙᴜᴅɢᴇᴛ-ᴘʟᴀɴꜱ
const messageId = '1573738387918299259';
const advancePlansChannelId = '1573281486822445128'; // # ♘・ᴀᴅᴠᴀɴᴄᴇ-ᴘʟᴀɴꜱ
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.cloud';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# ${E.fireBlue} Dream Nodes | Budget Minecraft Plans
## ${E.hostinger} Maximum Resources • Pocket-Friendly Pricing

> ${E.sparkles} High-memory, multi-thread budget game servers tailored for creators, test networks, and communities seeking massive RAM and NVMe storage at the lowest cost.

### ${E.alert} Important Budget Node Notice:
> ${E.arrowBlue} **Basic DDoS Mitigation:** 10 Gbps protection (traffic attacks may cause brief interruption).
> ${E.arrowBlue} **Weekly Dynamic IP:** Server IPs rotate periodically; update IP in your domain weekly.
> ${E.arrowBlue} **Weekly Maintenance:** Scheduled 30-minute weekly window for node upkeep.`;

const sectionPro =
`### ${E.lightning} Pro Tier Plans

> ${E.arrowBlue} **Pro Start [ 8 GB ]** ➔ ${E.cash} \`₹350 /mo\`
> \`8 GB RAM\` ┃ \`400% CPU\` ┃ \`150 GB NVMe\` ┃ \`1 Gbps\`
> 
> ${E.arrowBlue} **Pro Advance [ 12 GB ]** ➔ ${E.cash} \`₹525 /mo\`
> \`12 GB RAM\` ┃ \`500% CPU\` ┃ \`200 GB NVMe\` ┃ \`1 Gbps\`
> 
> ${E.arrowBlue} **Pro Plus [ 16 GB ]** ➔ ${E.cash} \`₹700 /mo\`
> \`16 GB RAM\` ┃ \`600% CPU\` ┃ \`250 GB NVMe\` ┃ \`1 Gbps\``;

const sectionElite =
`### ${E.diamond} Elite Tier Plans

> ${E.arrowBlue} **Elite [ 24 GB ]** ➔ ${E.cash} \`₹1,050 /mo\`
> \`24 GB RAM\` ┃ \`700% CPU\` ┃ \`350 GB NVMe\` ┃ \`1 Gbps\`
> 
> ${E.arrowBlue} **Elite Plus [ 32 GB ]** ➔ ${E.cash} \`₹1,400 /mo\`
> \`32 GB RAM\` ┃ \`800% CPU\` ┃ \`500 GB NVMe\` ┃ \`1 Gbps\``;

const sectionEnterprise =
`### ${E.crownRed} Enterprise Tier Plans

> ${E.arrowBlue} **Enterprise [ 48 GB ]** ➔ ${E.cash} \`₹2,100 /mo\`
> \`48 GB RAM\` ┃ \`1200% CPU\` ┃ \`750 GB NVMe\` ┃ \`1 Gbps\`
> 
> ${E.arrowBlue} **Enterprise Plus [ 64 GB ]** ➔ ${E.cash} \`₹2,800 /mo\`
> \`64 GB RAM\` ┃ \`1600% CPU\` ┃ \`1 TB NVMe\` ┃ \`1 Gbps\``;

const sectionTitan =
`### ${E.rocket} Titan Colossus Plans

> ${E.arrowBlue} **Titan [ 128 GB ]** ➔ ${E.cash} \`₹5,600 /mo\`
> \`128 GB RAM\` ┃ \`3200% CPU\` ┃ \`2 TB NVMe\` ┃ \`1 Gbps\`
> 
> ${E.arrowBlue} **Titan Max [ 256 GB ]** ➔ ${E.cash} \`₹11,200 /mo\`
> \`256 GB RAM\` ┃ \`6400% CPU\` ┃ \`4 TB NVMe\` ┃ \`1 Gbps\``;

const sectionFooter =
`### ${E.settings} Included Features:
> ${E.tick5} **Pterodactyl Panel Access** (Full Root File Access, SFTP, Split Ports)
> ${E.chest} **Unlimited MySQL Databases** ┃ ${E.backup} **Automated Backups**
> ${E.hostinger} **Instant Provisioning Upon Ticket Confirmation**

> ${E.shield} **Need enterprise DDoS defense & zero downtime? Check <#${advancePlansChannelId}>!**`;

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
          content: `-# ${E.verifiedBlue} Dream Nodes • High-Resource Budget Minecraft Hosting`
        }
      ]
    }
  ]
};

async function updateBudgetPlans() {
  console.log('Updating Budget Plans V2 Container...');
  const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(v2Payload)
  });

  const data = await res.json();
  if (data.id) {
    console.log('✓ Successfully updated Budget Plans embed! Message ID:', data.id);
  } else {
    console.error('✗ Failed to update:', JSON.stringify(data, null, 2));
  }
}

if (require.main === module) {
  updateBudgetPlans();
}

module.exports = { updateBudgetPlans, v2Payload };
