const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const termsChannelId = '1573337303538208778';
const messageId = '1573410085298774218';

const payload = {
  flags: 32768,
  components: [
    {
      type: 17, // Borderless Container
      components: [
        {
          type: 10,
          content:
            `# ${E.fireBlue} Dream Nodes | Official Terms & Policies\n\n` +
            `> ${E.hostinger} **Welcome to the official terms and policies hub of Dream Nodes!**\n` +
            `> \n` +
            `> ${E.sparkles} A premium cloud and game hosting provider built for ultra-fast performance, rock-solid stability, and 24/7 uptime. Whether you are running a massive Minecraft network or deploying high-speed cloud VPS nodes, our infrastructure is built to scale.\n\n` +
            `## ${E.alert} Explore Our Policies\n` +
            `> ${E.arrowWhite} Select a category from the dropdown menu below to access its detailed terms, fair-use policies, and discover more about Dream Nodes.\n\n` +
            `Choose a policy below to get started. ${E.hostinger}`
        },
        {
          type: 14, // Separator
          divider: true,
          spacing: 1
        },
        {
          type: 1, // ActionRow with Select Menu
          components: [
            {
              type: 3,
              custom_id: 'tos_select_menu',
              placeholder: 'Make a selection',
              min_values: 1,
              max_values: 1,
              options: [
                {
                  label: 'Refund Policy',
                  value: 'tos_refund',
                  description: 'Select To View Our Official Refund Policy & Terms',
                  emoji: B.cash
                },
                {
                  label: 'VPS & RDP Policies',
                  value: 'tos_vps',
                  description: 'Select To View VPS Fair Use, Resource Limits & Rules',
                  emoji: B.vps
                },
                {
                  label: 'Minecraft Hosting Policies',
                  value: 'tos_mc',
                  description: 'Select To View MC Server Rules, Uptime SLA & DDoS Protection',
                  emoji: B.minecraft
                },
                {
                  label: 'General Terms of Service',
                  value: 'tos_general',
                  description: 'Select To View General Service Terms, Billing & Termination',
                  emoji: B.membership
                },
                {
                  label: 'Community & Support Rules',
                  value: 'tos_discord',
                  description: 'Select To View Community Guidelines & Ticket Support Etiquette',
                  emoji: B.discord
                }
              ]
            }
          ]
        },
        {
          type: 14, // Separator
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content:
            `## ${E.lightning} Official Terms & Security\n` +
            `> ${E.cross} Always ensure your account and services adhere to our fair-use standards. Prohibited activities including DDoS, mining, port scanning, and abuse will result in immediate termination.\n\n` +
            `---\n\n` +
            `> ${E.hostinger} **Stay connected. Stay informed. Grow together.**\n` +
            `> \n` +
            `> ${E.verifiedBlue} Thank you for being part of **Dream Nodes**!`
        }
      ]
    }
  ]
};

async function updateTerms() {
  console.log('Patching Terms & Refund Policy embed in channel', termsChannelId);
  const url = `https://discord.com/api/v10/channels/${termsChannelId}/messages/${messageId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
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
