const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const termsChannelId = '1573337303538208778';
const messageId = '1573410085298774218';

const payload = {
  flags: 32768,
  components: [
    {
      type: 17, // Container with accent_color: null (borderless)
      components: [
        {
          type: 10,
          content:
            '### <a:b_fire:1573381944702533732> • DREAM NODES [TOS & POLICIES]\n\n' +
            '**Server Information**\n' +
            '| <a:hostinger:1573382335355691089> **Welcome to Dream Nodes!**\n' +
            '| <a:sparkles_sparkles:1573382447603785928> A premium cloud and game server hosting provider built for ultra-fast performance, rock-solid stability, and 24/7 uptime. Whether you are launching a massive Minecraft network or deploying high-speed cloud VPS nodes, we provide enterprise-grade infrastructure.\n\n' +
            '<a:fsk_warning:1573382318364692703> • **Discover Our Policies**\n' +
            '| <a:Arrow_White:1573382131026108678> Explore our official terms of service, refund rules, VPS fair-use limits, and Minecraft hosting guidelines.\n' +
            '| Select a category below to learn more.'
        },
        {
          type: 1,
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
                  emoji: { id: '1573382269735805008', name: 'cash', animated: true }
                },
                {
                  label: 'VPS & RDP Policies',
                  value: 'tos_vps',
                  description: 'Select To View VPS Fair Use, Resource Limits & Rules',
                  emoji: { id: '1573382507863220246', name: 'vps', animated: false }
                },
                {
                  label: 'Minecraft Hosting Policies',
                  value: 'tos_mc',
                  description: 'Select To View MC Server Rules, Uptime SLA & DDoS Protection',
                  emoji: { id: '1573382379215659081', name: 'minecraft', animated: true }
                },
                {
                  label: 'General Terms of Service',
                  value: 'tos_general',
                  description: 'Select To View General Service Terms, Billing & Termination',
                  emoji: { id: '1573382371699458201', name: 'membership', animated: true }
                },
                {
                  label: 'Community & Support Rules',
                  value: 'tos_discord',
                  description: 'Select To View Community Guidelines & Ticket Support Etiquette',
                  emoji: { id: '1573382300283179030', name: 'discord_discord', animated: true }
                }
              ]
            }
          ]
        },
        {
          type: 10,
          content:
            '<a:Lightning:1573382171257737317> • **Grow With Dream Nodes**\n' +
            '| <a:Tick5:1573382205395177532> Scale your projects with confidence backed by 99.9% uptime SLA and automated 24/7 DDoS mitigation.\n\n' +
            '💙 **Together, We Grow.**'
        }
      ]
    }
  ]
};

async function updateTerms() {
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
  console.log('Update result:', data.id ? `SUCCESS ${data.id}` : data);
}

updateTerms();
