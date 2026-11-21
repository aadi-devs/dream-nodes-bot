const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281561493766164'; // # ⚜・ᴡᴇʙ-ʜᴏꜱᴛɪɴɢ
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.com';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# <a:2251worldrainbow:1573382112436949044> 𝐃𝐑𝐄𝐀𝐌 𝐍𝐎𝐃𝐄𝐒 ┃ High-Speed cPanel Web Hosting
## 🌐 Powered by cPanel • Pure NVMe SSD • Free SSL • 1-Click WordPress

> <a:sparkles_sparkles:1573382447603785928> **Fast, Secure & Reliable cPanel Web Hosting:** Everything your website, blog, community portal, or e-commerce store needs. Powered by industry-leading **cPanel**, high-frequency NVMe storage, automated SSL certificates, and LiteSpeed web acceleration.`;

const sectionPlans =
`### <a:b_fire:1573381944702533732> cPanel Web Hosting Packages:

> 🌐 **WEBSPACE S** \`[ STARTER ]\` ── <a:cash:1573382269735805008> **\`₹229 /mo\`**
> ✦ **Domains:** \`1 Domain\` ┃ <:disk:1573382500795818114> **Storage:** \`25 GB NVMe\`
> ✦ **Email:** \`10 Accounts\` ┃ <:bandwith55:1573382523201912842> **Bandwidth:** \`Unlimited\` ┃ 🔒 **SSL:** \`Free Auto-SSL\`
> 
> ⭐ **WEBSPACE M** \`[ BUSINESS • MOST POPULAR ]\` ── <a:cash:1573382269735805008> **\`₹399 /mo\`**
> ✦ **Domains:** \`2 Domains\` ┃ <:disk:1573382500795818114> **Storage:** \`50 GB NVMe\`
> ✦ **Email:** \`20 Accounts\` ┃ <:bandwith55:1573382523201912842> **Bandwidth:** \`Unlimited\` ┃ 🔒 **SSL:** \`Free Auto-SSL\`
> 
> 👑 **WEBSPACE L** \`[ AGENCY • UNLIMITED DOMAINS ]\` ── <a:cash:1573382269735805008> **\`₹689 /mo\`**
> ✦ **Domains:** \`Unlimited Domains\` ┃ <:disk:1573382500795818114> **Storage:** \`100 GB NVMe\`
> ✦ **Email:** \`50 Accounts\` ┃ <:bandwith55:1573382523201912842> **Bandwidth:** \`Unlimited\` ┃ 🔒 **SSL:** \`Free Auto-SSL\``;

const sectionFeatures =
`### <a:settings:1573382421611806763> Industry-Leading cPanel Suite Included:
> 🎛️ **Full cPanel Control:** Manage your entire web presence with the world's #1 intuitive hosting control panel.
> 🚀 **1-Click Softaculous & WordPress:** Install WordPress, Joomla, Drupal, phpBB, Laravel, and 400+ apps in a single click.
> 🔒 **Automated Free SSL:** Let's Encrypt SSL certificates automatically generated and renewed for all domains.
> 📧 **Professional Webmail:** Create custom email accounts (\`contact@yourdomain.com\`) with webmail access and spam defense.
> 🗄️ **phpMyAdmin & MySQL Databases:** Full MySQL/MariaDB database management with remote access support.
> ⚡ **LiteSpeed Caching & PHP Selector:** Switch seamlessly between PHP 7.4 through PHP 8.3 with built-in opcode caching.
> 🛡️ **Always-On Anti-DDoS Mitigation:** Real-time protection against malicious bot attacks and volumetric HTTP floods.
> 🕒 **99.9% Uptime Guarantee:** High-availability cluster infrastructure with automated daily backups.`;

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
              emoji: { name: '🌐' }
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
          content: '-# 🌐 Dream Nodes • High-Performance cPanel Cloud Web Hosting Solutions'
        }
      ]
    }
  ]
};

async function postWebHostingPlans() {
  console.log('Posting Web Hosting Plans V2 Container to channel', channelId);
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
    console.log('✓ Successfully posted Web Hosting embed! Message ID:', data.id);
    
    // Add reactions
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${data.id}/reactions/%F0%9F%8C%90/@me`, { // 🌐
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${data.id}/reactions/%E2%9A%A1/@me`, { // ⚡
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
  } else {
    console.error('✗ Failed to post:', JSON.stringify(data, null, 2));
  }
}

postWebHostingPlans();
