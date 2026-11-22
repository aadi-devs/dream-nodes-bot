require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

async function patchTermsV2() {
  const token = process.env.DISCORD_TOKEN;
  const termsChannelId = '1573337303538208778';
  const termsMessageId = '1573410085298774218';

  const bannerPath = path.join(__dirname, '..', 'assets', 'terms_banner.jpg');
  if (!fs.existsSync(bannerPath)) {
    throw new Error(`Banner file not found at: ${bannerPath}`);
  }
  const bannerBuf = fs.readFileSync(bannerPath);

  const containerComponents = [
    // 1. Header
    {
      type: 10,
      content:
        `# ${E.rulesBook} **DREAM NODES ┃ Official Terms & Policies**\n` +
        `> ${E.sparkles} Master service agreements, acceptable use standards, and client compliance.`
    },
    // 2. Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // 3. Media Gallery (Banner)
    {
      type: 12,
      items: [
        {
          media: {
            url: 'attachment://terms_banner.jpg'
          }
        }
      ]
    },
    // 4. Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // 5. Overview Text
    {
      type: 10,
      content:
        `### ${E.security} **Enterprise Cloud Compliance & Standards**\n` +
        `> Dream Nodes delivers high-performance cloud compute, enterprise VPS nodes, and DDoS-shielded game servers. All services operate under strict compliance, resource fair-use, and service level agreements (SLA).\n` +
        `> \n` +
        `> ${E.arrowBlue} **Explore Policies:** Select any category from the menu below to review its legal terms, refund policies, and operational rules.`
    },
    // 6. Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // 7. Select Menu (Action Row)
    {
      type: 1,
      components: [
        {
          type: 3,
          custom_id: 'tos_select_menu',
          placeholder: 'Select a policy to view details...',
          min_values: 1,
          max_values: 1,
          options: [
            {
              label: 'Refund Policy',
              value: 'tos_refund',
              description: '24-hour guarantee window, eligibility criteria & dispute terms',
              emoji: B.cash
            },
            {
              label: 'VPS & Cloud Policies',
              value: 'tos_vps',
              description: 'Resource quotas, acceptable use & prohibited workloads',
              emoji: B.vps
            },
            {
              label: 'Minecraft Hosting Policies',
              value: 'tos_mc',
              description: 'Uptime SLA, packet mitigation & server etiquette',
              emoji: B.minecraft
            },
            {
              label: 'General Terms of Service',
              value: 'tos_general',
              description: 'Master service contract, billing cycles & account rules',
              emoji: B.rulesBook
            },
            {
              label: 'Community & Support Guidelines',
              value: 'tos_discord',
              description: 'Discord lounge rules, ticket etiquette & code of conduct',
              emoji: B.discord
            }
          ]
        }
      ]
    },
    // 8. Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // 9. Zero-Tolerance Section
    {
      type: 10,
      content:
        `### ${E.shield} **Zero-Tolerance Abuse Enforcement**\n` +
        `> ${E.alert} Prohibited operations—including DDoS stress testing, crypto mining, botnet command nodes, port scanning, and abusive packet flooding—result in **instant permanent termination without refund**.\n` +
        `> \n` +
        `> ${E.arrowBlue} **Questions or Custom Agreements?** Open an inquiry ticket in <#1573281601775870043>.`
    },
    // 10. Footer
    {
      type: 10,
      content: `-# ${E.verifiedBlue} Dream Nodes • Legal & Compliance Gateway • All Rights Reserved`
    }
  ];

  const payload = {
    flags: 32768,
    content: '',
    embeds: [],
    attachments: [{ id: 0, filename: 'terms_banner.jpg' }],
    components: [
      {
        type: 17,
        accent_color: null,
        components: containerComponents
      }
    ]
  };

  const formData = new FormData();
  formData.append('files[0]', new File([bannerBuf], 'terms_banner.jpg', { type: 'image/jpeg' }));
  formData.append('payload_json', JSON.stringify(payload));

  console.log(`Patching Terms & Policy message ${termsMessageId} in channel ${termsChannelId}...`);
  const res = await fetch(`https://discord.com/api/v10/channels/${termsChannelId}/messages/${termsMessageId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bot ${token}` },
    body: formData
  });

  const data = await res.json();
  if (res.ok) {
    console.log('SUCCESS! Terms & Policy message patched with V2 Container & Custom Banner:', data.id);
  } else {
    console.error('FAILED to patch message:', JSON.stringify(data, null, 2));
  }
}

patchTermsV2().catch(console.error);
