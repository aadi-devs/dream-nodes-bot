const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281561493766164'; // # ⚜・ᴡᴇʙ-ʜᴏꜱᴛɪɴɢ
const messageId = '1573766242203078758';
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.cloud';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# ${E.world} DREAM NODES ┃ High-Speed cPanel Web Hosting
## ${E.clouds} Powered by cPanel • Pure NVMe SSD • Free SSL • 1-Click WordPress

> ${E.sparkles} **Fast, Secure & Reliable cPanel Web Hosting:** Everything your website, blog, community portal, or e-commerce store needs. Powered by industry-leading **cPanel**, high-frequency NVMe storage, automated SSL certificates, and LiteSpeed web acceleration.`;

const sectionPlans =
`### ${E.fireBlue} cPanel Web Hosting Packages:

> ${E.arrowOrange} **WEBSPACE S** \`[ STARTER ]\` ── ${E.cash} **\`₹229 /mo\`**
> ${E.arrowBlue} **Domains:** \`1 Domain\` ┃ ${E.disk} **Storage:** \`25 GB NVMe\`
> ${E.arrowBlue} **Email:** \`10 Accounts\` ┃ ${E.bandwidth} **Bandwidth:** \`Unlimited\` ┃ ${E.security} **SSL:** \`Free Auto-SSL\`
> 
> ${E.starRotating} **WEBSPACE M** \`[ BUSINESS • POPULAR ]\` ── ${E.cash} **\`₹399 /mo\`**
> ${E.arrowBlue} **Domains:** \`2 Domains\` ┃ ${E.disk} **Storage:** \`50 GB NVMe\`
> ${E.arrowBlue} **Email:** \`20 Accounts\` ┃ ${E.bandwidth} **Bandwidth:** \`Unlimited\` ┃ ${E.security} **SSL:** \`Free Auto-SSL\`
> 
> ${E.crownRed} **WEBSPACE L** \`[ AGENCY • UNLIMITED ]\` ── ${E.cash} **\`₹689 /mo\`**
> ${E.arrowBlue} **Domains:** \`Unlimited Domains\` ┃ ${E.disk} **Storage:** \`100 GB NVMe\`
> ${E.arrowBlue} **Email:** \`50 Accounts\` ┃ ${E.bandwidth} **Bandwidth:** \`Unlimited\` ┃ ${E.security} **SSL:** \`Free Auto-SSL\``;

const sectionFeatures =
`### ${E.settings} Industry-Leading cPanel Suite Included:
> ${E.controller} **Full cPanel Control:** Manage your entire web presence with the world's #1 intuitive control panel.
> ${E.rocket} **1-Click Softaculous & WordPress:** Install WordPress, Drupal, phpBB, Laravel, and 400+ apps in 1 click.
> ${E.security} **Automated Free SSL:** Certificates automatically generated and renewed for all domains.
> ${E.chat} **Professional Webmail:** Create custom email accounts with webmail access and spam defense.
> ${E.chest} **phpMyAdmin & MySQL:** Full MySQL/MariaDB database management with remote access support.
> ${E.lightning} **LiteSpeed Caching & PHP Selector:** Switch seamlessly between PHP 7.4 through PHP 8.3.
> ${E.shield} **Always-On Anti-DDoS Mitigation:** Protection against malicious bots and HTTP floods.
> ${E.timer} **99.9% Uptime Guarantee:** High-availability cluster infrastructure with automated backups.`;

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
          content: sectionPlans
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionFeatures
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
              label: 'Order Web Hosting / Open Ticket',
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
          content: `-# ${E.verifiedBlue} Dream Nodes • High-Performance cPanel Cloud Web Hosting Solutions`
        }
      ]
    }
  ]
};

async function updateWebHostingPlans() {
  console.log('Patching Web Hosting Plans embed in channel', channelId);
  const patchRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(v2Payload)
  });
  const patchData = await patchRes.json();
  if (patchData.id) {
    console.log('✓ Successfully updated Web Hosting Plans embed! Message ID:', patchData.id);
  } else {
    console.error('✗ Failed to patch Web Hosting Plans:', JSON.stringify(patchData, null, 2));
  }
}

if (require.main === module) {
  updateWebHostingPlans();
}

module.exports = { updateWebHostingPlans, v2Payload };
