const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281547564359710'; // # ⚜・ᴅᴏᴍᴀɪɴ-ᴘʟᴀɴꜱ
const messageId = '1573746263441022988';
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.cloud';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# ${E.world} DREAM NODES ┃ Domain & DNS Services
## ${E.link} High-Speed DNS Routing • Custom Domains • Instant Subdomains

> ${E.sparkles} **Build Your Online Brand & Presence With Dream Nodes!**
> Choose from budget-friendly subdomains, custom .fun extensions, or global premium TLDs (.com, .in, .net) with full Cloudflare DNS management.`;

const sectionSubdomains =
`### ${E.arrowBlue} 01. Dream Nodes Subdomains
> ${E.cash} **Price:** \`₹20 / Month\`
> 
> ${E.arrowBlue} Get a professional **.dreamnodes.cloud** address for your Minecraft server, game network, or control panel without purchasing a full domain.
> 
> ${E.link} **Live Examples:**
> ${E.arrowRight} \`yourname.dreamnodes.cloud\`
> ${E.arrowRight} \`play.dreamnodes.cloud\`
> ${E.arrowRight} \`myserver.dreamnodes.cloud\``;

const sectionCustomFun =
`### ${E.diamond} 02. Custom .FUN Top-Level Domains
> ${E.cash} **Price:** \`₹299 / Year\`
> 
> ${E.arrowBlue} Register your own standalone **.fun** domain for your brand, gaming community, website, or server with full ownership.
> 
> ${E.link} **Examples:**
> ${E.arrowRight} \`yourbrand.fun\`
> ${E.arrowRight} \`myserver.fun\`
> ${E.arrowRight} \`gaminghub.fun\``;

const sectionGlobalTlds =
`### ${E.settings} 03. Custom Global TLD Extensions
> Looking for a specific regional or international domain extension?
> 
> ${E.arrowBlue} **Popular TLDs:** \`.com\` ┃ \`.in\` ┃ \`.net\` ┃ \`.org\` ┃ \`.dev\` ┃ \`.store\` ┃ \`.xyz\` & more!
> 
> ${E.ticket} **How To Order:** Open a ticket with your desired domain name. Our staff will immediately check registry availability and quote the lowest rate!`;

const sectionFeatures =
`### ${E.shield} What's Included With Every Domain:
> ${E.tick5} **Cloudflare Anycast DNS:** Lightning-fast global resolution with integrated DDoS protection.
> ${E.tick5} **Full DNS Control:** Easily configure A, AAAA, CNAME, MX, TXT, and SRV (Minecraft) records.
> ${E.tick5} **Free SSL / TLS:** Automatic HTTPS encryption certificates configured for all hosts.
> ${E.tick5} **Instant Server Linking:** 1-click binding to your Dream Nodes VPS or game server.`;

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
          content: `-# ${E.verifiedBlue} Dream Nodes • Professional Domain Registrar & High-Speed DNS Services`
        }
      ]
    }
  ]
};

async function updateDomainPlans() {
  console.log('Patching Domain Plans embed in channel', channelId);
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
    console.log('✓ Successfully updated Domain Plans embed! Message ID:', patchData.id);
  } else {
    console.error('✗ Failed to patch Domain Plans:', JSON.stringify(patchData, null, 2));
  }
}

if (require.main === module) {
  updateDomainPlans();
}

module.exports = { updateDomainPlans, v2Payload };
