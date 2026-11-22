const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281547564359710'; // # ⚜・ᴅᴏᴍᴀɪɴ-ᴘʟᴀɴꜱ
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.cloud';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# <a:2251worldrainbow:1573382112436949044> 𝐃𝐑𝐄𝐀𝐌 𝐍𝐎𝐃𝐄𝐒 ┃ Domain & DNS Services
## 🌐 High-Speed DNS Routing • Custom Domains • Instant Subdomains

> <a:sparkles_sparkles:1573382447603785928> **Build Your Online Brand & Presence With Dream Nodes!**
> Choose from budget-friendly subdomains, custom .fun extensions, or global premium TLDs (.com, .in, .net) with full Cloudflare DNS management.`;

const sectionSubdomains =
`### 🏷️ 01. Dream Nodes Subdomains
> <a:cash:1573382269735805008> **Price:** \`₹20 / Month\`
> 
> <a:arrowf:1573382243827585114> Get a professional **.dreamnodes.cloud** address for your Minecraft server, game network, or control panel without purchasing a full domain.
> 
> 📂 **Live Examples:**
> ✦ \`yourname.dreamnodes.cloud\`
> ✦ \`play.dreamnodes.cloud\`
> ✦ \`myserver.dreamnodes.cloud\``;

const sectionCustomFun =
`### ✨ 02. Custom .FUN Top-Level Domains
> <a:cash:1573382269735805008> **Price:** \`₹299 / Year\`
> 
> <a:arrowf:1573382243827585114> Register your own standalone **.fun** domain for your brand, gaming community, website, or server with full ownership.
> 
> 📂 **Examples:**
> ✦ \`yourbrand.fun\`
> ✦ \`myserver.fun\`
> ✦ \`gaminghub.fun\``;

const sectionGlobalTlds =
`### <a:settings:1573382421611806763> 03. Custom Global TLD Extensions
> Looking for a specific regional or international domain extension?
> 
> <a:arrowf:1573382243827585114> **Popular TLDs:** \`.com\` ┃ \`.in\` ┃ \`.net\` ┃ \`.org\` ┃ \`.dev\` ┃ \`.store\` ┃ \`.xyz\` & more!
> 
> 🎫 **How To Order:** Open a ticket with your desired domain name. Our staff will immediately check registry availability and quote the lowest rate!`;

const sectionFeatures =
`### 🛡️ What's Included With Every Domain:
> <a:Tick5:1573382205395177532> **Cloudflare Anycast DNS:** Lightning-fast global resolution with integrated DDoS protection.
> <a:Tick5:1573382205395177532> **Full DNS Control:** Easily configure A, AAAA, CNAME, MX, TXT, and SRV (Minecraft) records.
> <a:Tick5:1573382205395177532> **Free SSL / TLS:** Automatic HTTPS encryption certificates configured for all hosts.
> <a:Tick5:1573382205395177532> **Instant Server Linking:** 1-click binding to your Dream Nodes VPS or game server.`;

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
          content: sectionSubdomains
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionCustomFun
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionGlobalTlds
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
              label: 'Register Domain / Open Ticket',
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
          content: '-# 🌐 Dream Nodes • Professional Domain Registrar & High-Speed DNS Services'
        }
      ]
    }
  ]
};

async function postDomainPlans() {
  console.log('Posting Domain Plans V2 Container to channel', channelId);
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
    console.log('✓ Successfully posted Domain Plans embed! Message ID:', data.id);
    
    // Add reactions
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${data.id}/reactions/%F0%9F%8C%90/@me`, { // 🌐
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${data.id}/reactions/%E2%9C%A8/@me`, { // ✨
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
  } else {
    console.error('✗ Failed to post:', JSON.stringify(data, null, 2));
  }
}

postDomainPlans();
