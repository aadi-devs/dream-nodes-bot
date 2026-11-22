const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const termsChannelId = '1573337303538208778';
const messageId = '1573410085298774218';

const bannerPath = path.join(__dirname, '..', 'assets', 'terms_banner.jpg');
const bannerBuf = fs.readFileSync(bannerPath);

const payload = {
  flags: 32768,
  content: '',
  embeds: [],
  attachments: [{ id: 0, filename: 'terms_banner.jpg' }],
  components: [
    {
      type: 17,
      accent_color: null,
      components: [
        {
          type: 10,
          content:
            `# ${E.rulesBook} **DREAM NODES ┃ Official Terms & Policies**\n` +
            `> ${E.sparkles} Master service agreements, acceptable use standards, and client compliance.`
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
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
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content:
            `### ${E.security} **Enterprise Cloud Compliance & Standards**\n` +
            `> Dream Nodes delivers high-performance cloud compute, enterprise VPS nodes, and DDoS-shielded game servers. All services operate under strict compliance, resource fair-use, and service level agreements (SLA).\n` +
            `> \n` +
            `> ${E.arrowBlue} **Explore Policies:** Select any category from the menu below to review its legal terms, refund policies, and operational rules.`
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
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
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content:
            `### ${E.shield} **Zero-Tolerance Abuse Enforcement**\n` +
            `> ${E.alert} Prohibited operations—including DDoS stress testing, crypto mining, botnet command nodes, port scanning, and abusive packet flooding—result in **instant permanent termination without refund**.\n` +
            `> \n` +
            `> ${E.arrowBlue} **Questions or Custom Agreements?** Open an inquiry ticket in <#1573281601775870043>.`
        },
        {
          type: 10,
          content: `-# ${E.verifiedBlue} Dream Nodes • Legal & Compliance Gateway • All Rights Reserved`
        }
      ]
    }
  ]
};

async function updateTerms() {
  console.log('Patching Terms & Refund Policy embed in channel', termsChannelId);
  const formData = new FormData();
  formData.append('files[0]', new File([bannerBuf], 'terms_banner.jpg', { type: 'image/jpeg' }));
  formData.append('payload_json', JSON.stringify(payload));

  const url = `https://discord.com/api/v10/channels/${termsChannelId}/messages/${messageId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${token}`
    },
    body: formData
  });
  const data = await res.json();
  if (data.id) {
    console.log('✓ Successfully updated Terms & Refund Policy embed! Message ID:', data.id);
  } else {
    console.error('✗ Failed to patch Terms & Refund Policy:', JSON.stringify(data, null, 2));
  }
}

if (require.main === module) {
  updateTerms();
}

module.exports = { updateTerms, payload };
