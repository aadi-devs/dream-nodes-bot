const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const GUILD_ID = '1573272872737181696';
const CATEGORY_ID = '1573281533538598944'; // ✦----- OTHER PLANS -----✦
const CHANNEL_NAME = '⚜・ᴅᴅᴏꜱ-ᴘʀᴏᴛᴇᴄᴛɪᴏɴ';
const TICKET_CHANNEL_URL = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const WEBSITE_URL = 'https://www.dreamnodes.cloud';

const E = {
  logo: '<a:dn_anim_2:1574104149631701133>',
  shield: '<:shield:1574105318617518080>',
  flash: '<a:blue_flash_gn:1574104336735141938>',
  cloud: '<a:clouds_gif:1574104444617097276>',
  magic: '<a:crystal:1574104488191463444>',
  bandwidth: '<:bandwith55:1574105446959030282>',
  chart: '<:chart_up:1574105572087959682>',
  lock: '<:tc_lock:1574106381378920590>',
  arrow: '<a:animatedarrowbluelite:1574104177334816849>',
  verified: '<a:verified_blue:1574105151596531862>',
  sword: '<a:pvp_sword_gif:1574104926047707278>',
  node: '<a:nodeon:1574104825459904592>',
  server: '<:blurpleserver:1574105511513554994>'
};

async function main() {
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    console.error('Missing DISCORD_TOKEN');
    process.exit(1);
  }

  // 1. Create the channel
  console.log(`Creating channel ${CHANNEL_NAME}...`);
  const createRes = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/channels`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: CHANNEL_NAME,
      type: 0,
      parent_id: CATEGORY_ID,
      topic: 'Dream Shield™ DDoS Protection powered by Cloudflare Magic Transit (14 Tbps+ Mitigation)'
    })
  });

  const channel = await createRes.json();
  if (!createRes.ok) {
    console.error('Failed to create channel:', createRes.status, channel);
    process.exit(1);
  }
  console.log('Created channel:', channel.id, channel.name);

  // 2. Post Components V2 Embed with Dropdown Menu
  const payload = {
    flags: 32768, // IS_COMPONENTS_V2
    content: '',
    embeds: [],
    components: [
      {
        type: 17, // Borderless Container V2
        accent_color: null,
        components: [
          {
            type: 10,
            content:
              `# ${E.logo} **DREAM SHIELD™ // DDOS PROTECTION** ${E.flash}\n` +
              `## ${E.shield} **POWERED BY CLOUDFLARE MAGIC TRANSIT • 14 TBPS+ DEFENSE** ${E.cloud}\n\n` +
              `> ${E.magic} **Enterprise-Grade Anycast Mitigation for Everyone**\n` +
              `> Protect your **Minecraft server**, **Single VPS**, or **Full Network Infrastructure** with **Dream Shield™** — backed by **14 Tbps+ Cloudflare Magic Transit** scrubbing across 330+ global PoPs.`
          },
          {
            type: 14,
            divider: true,
            spacing: 1
          },
          {
            type: 10,
            content:
              `### ${E.bandwidth} **MAGIC TRANSIT & DREAM SHIELD™ SPECS** ${E.chart}\n` +
              `\`\`\`yaml\n` +
              `Mitigation Engine  : Cloudflare Magic Transit + BGP Anycast\n` +
              `Scrubbing Capacity : 14 Tbps+ Automated Line-Rate Defense\n` +
              `Filtering Layers   : L3/L4 Volumetric + L7 Game & App Filters\n` +
              `Origin Security    : 100% Masked / Zero IP Leakage\n` +
              `Reaction Time      : Sub-Millisecond Automated Scrubbing\n` +
              `\`\`\``
          },
          {
            type: 14,
            divider: true,
            spacing: 1
          },
          {
            type: 10,
            content:
              `### ${E.lock} **SELECT A PROTECTION TIER BELOW**\n` +
              `> ${E.arrow} Use the **dropdown menu** below to view full pricing & details for **Minecraft**, **Single VPS**, or **Full Network / Infrastructure**.`
          },
          {
            type: 1, // Action Row: String Select Dropdown
            components: [
              {
                type: 3,
                custom_id: 'ddos_plan_select',
                placeholder: '🛡️ Choose a Dream Shield™ Protection Plan...',
                min_values: 1,
                max_values: 1,
                options: [
                  {
                    label: 'Minecraft DDoS Protection',
                    value: 'ddos_minecraft',
                    description: '₹250/month • L7 Game Filters, Magic Transit & 14 Tbps+ Defense',
                    emoji: { id: '1574104926047707278', name: 'pvp_sword_gif', animated: true }
                  },
                  {
                    label: 'Single VPS DDoS Protection',
                    value: 'ddos_vps',
                    description: '₹600/mo (With Dedicated IP) • ₹400/mo (Without Dedicated IP)',
                    emoji: { id: '1574104825459904592', name: 'nodeon', animated: true }
                  },
                  {
                    label: 'Full Network / Infrastructure',
                    value: 'ddos_infra',
                    description: 'Custom BGP Anycast & GRE Tunnels • Open a ticket to discuss',
                    emoji: { id: '1574105511513554994', name: 'blurpleserver', animated: false }
                  }
                ]
              }
            ]
          },
          {
            type: 1, // Action Row: Quick Links
            components: [
              {
                type: 2,
                style: 5,
                label: 'Open Order Ticket',
                emoji: { id: '1574105318617518080', name: 'shield', animated: false },
                url: TICKET_CHANNEL_URL
              },
              {
                type: 2,
                style: 5,
                label: 'Explore Website',
                emoji: { id: '1574104444617097276', name: 'clouds_gif', animated: true },
                url: WEBSITE_URL
              }
            ]
          },
          {
            type: 10,
            content: `-# ${E.verified} Dream Nodes Network Security • Dream Shield™ × Cloudflare Magic Transit (14 Tbps+)`
          }
        ]
      }
    ]
  };

  const msgRes = await fetch(`https://discord.com/api/v10/channels/${channel.id}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const msg = await msgRes.json();
  if (!msgRes.ok) {
    console.error('Failed to post message:', msgRes.status, msg);
    process.exit(1);
  }
  console.log('Posted Components V2 message:', msg.id);
}

main().catch(console.error);
