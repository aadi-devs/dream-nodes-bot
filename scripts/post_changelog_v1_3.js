const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { E, B } = require('../src/emojis');

const targetChannelId = '1573281468145336441'; // # 𖹭ᐟ・ᴄʜᴀɴɢᴇʟᴏɢꜱ
const bannerPath = path.join(__dirname, '..', 'assets', 'changelog_banner.jpg');
const clientRoleId = '1573412778620747886'; // ⋆｡°✩ ƈʅιҽɳƚ ✩°｡⋆

async function main() {
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    console.error('Missing DISCORD_TOKEN');
    process.exit(1);
  }

  if (!fs.existsSync(bannerPath)) {
    console.error('Banner not found at', bannerPath);
    process.exit(1);
  }

  const bannerBuf = fs.readFileSync(bannerPath);

  const headerText =
`# ${E.updates} **DREAM NODES ┃ SYSTEM CHANGELOG** ${E.sparkles}\n\n` +
`> ${E.announce} **Platform & Infrastructure Expansion • Release v1.3.0**\n` +
`> ${E.lightning} Enterprise security deployment, automated game tools, and dedicated bot hosting.`;

  const dreamShieldHighlight =
`### ${E.shield} **MAIN HIGHLIGHT: Dream Shield™ Activated** ${E.fireWorld}\n` +
`> ${E.diamond} **Enterprise-Grade DDoS Protection is now officially active exclusively on all Advanced Plans!**\n` +
`> \n` +
`> ${E.arrowBlue} **Full Enterprise Filtering:** Multi-terabit volumetric scrubbing with proprietary L4 & L7 gaming filters tailored to neutralize UDP floods, SYN attacks, and Minecraft-specific exploits.\n` +
`> ${E.arrowBlue} **Zero-Latency Routing:** Clean traffic is routed directly through high-speed transit paths, guaranteeing smooth 20 TPS gameplay with zero latency penalty during attacks.\n` +
`> ${E.arrowBlue} **Advanced Plans Exclusive:** All active and future nodes deployed on our **Advanced Tier** lineup now enjoy uninterrupted Dream Shield defense automatically.`;

  const featuresText =
`### ${E.settings} **New Control Panel Additions & Features:**\n\n` +
`> ${E.arrowBlue} ${E.minecraft} **One-Click Version Changer**\n` +
`> Seamlessly switch your Minecraft server engine and version on the fly. Swap between Paper, Purpur, Spigot, Vanilla, Fabric, Forge, NeoForge, and Velocity directly from the panel with zero manual JAR uploads.\n` +
`> \n` +
`> ${E.arrowBlue} ${E.discord} **Discord Bot Host Nest Added**\n` +
`> Introducing our dedicated **Discord Bot Hosting Nest**! Deploy 24/7 bots running Node.js, Python, Java, Go, or Rust with persistent consoles, environment variable managers, and auto-restart on crash.\n` +
`> \n` +
`> ${E.arrowBlue} ${E.rulesBook} **Minecraft GUI Config Editor & Properties Changer**\n` +
`> Configure server settings visually! Customize \`server.properties\` and YAML/JSON files through interactive switches, sliders, and form fields—no raw text editing required.\n` +
`> \n` +
`> ${E.arrowBlue} ${E.world} **World Editor & High-Speed World Uploader**\n` +
`> In-browser world management! Inspect and configure server worlds directly in your control panel, or upload world archives (\`.zip\` / \`.tar.gz\`) with automated high-speed extraction.\n` +
`> \n` +
`> ${E.arrowBlue} ${E.rocket} **Automated Server Importer (SFTP)**\n` +
`> Migrating from another hosting provider? Transfer your entire server in one click by entering remote SFTP credentials—our importer automatically migrates all files directly.`;

  const closingText =
`${E.tick5} High-Frequency AMD Ryzen & Intel Xeon Cores • Gen4 NVMe Storage Arrays\n` +
`${E.tick5} 24/7 Dedicated Client Care • 99.9% Infrastructure Uptime SLA\n\n` +
`${E.chat} **Questions or need custom setup assistance?** Open a ticket in <#1573281601775870043> ||<@&${clientRoleId}>||`;

  const payload = {
    flags: 32768, // IS_COMPONENTS_V2
    content: '',
    embeds: [],
    attachments: [{ id: 0, filename: 'changelog_banner.jpg' }],
    components: [
      {
        type: 17, // Borderless Container
        accent_color: null,
        components: [
          // 1. Header
          {
            type: 10,
            content: headerText
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
                  url: 'attachment://changelog_banner.jpg'
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
          // 5. Main Highlight: Dream Shield
          {
            type: 10,
            content: dreamShieldHighlight
          },
          // 6. Divider
          {
            type: 14,
            divider: true,
            spacing: 1
          },
          // 7. New Panel Features
          {
            type: 10,
            content: featuresText
          },
          // 8. Divider
          {
            type: 14,
            divider: true,
            spacing: 1
          },
          // 9. Closing summary & role ping
          {
            type: 10,
            content: closingText
          },
          // 10. Divider
          {
            type: 14,
            divider: true,
            spacing: 1
          },
          // 11. Action Row Link Buttons
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 5,
                label: 'Client Panel',
                url: 'https://panel.dreamnodes.cloud',
                emoji: B.vps
              },
              {
                type: 2,
                style: 5,
                label: 'Advanced Plans',
                url: 'https://discord.com/channels/1573272872737181696/1573688254908207249',
                emoji: B.shield
              },
              {
                type: 2,
                style: 5,
                label: 'Order Hosting',
                url: 'https://discord.com/channels/1573272872737181696/1573281601775870043',
                emoji: B.cash
              },
              {
                type: 2,
                style: 5,
                label: 'Official Website',
                url: 'https://dreamnodes.cloud',
                emoji: B.fireWorld
              }
            ]
          },
          // 12. Footer
          {
            type: 10,
            content: `-# ${E.verifiedBlue} Dream Nodes • Next-Gen Cloud Infrastructure & 24/7 Client Care Desk`
          }
        ]
      }
    ]
  };

  const formData = new FormData();
  formData.append('payload_json', JSON.stringify(payload));
  formData.append('files[0]', new File([bannerBuf], 'changelog_banner.jpg', { type: 'image/jpeg' }));

  console.log('Posting Changelog v1.3.0 Components V2 container to channel:', targetChannelId);
  const res = await fetch(`https://discord.com/api/v10/channels/${targetChannelId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${token}`
    },
    body: formData
  });

  const data = await res.json();
  if (res.ok) {
    console.log('SUCCESS! Sent changelog message ID:', data.id);
  } else {
    console.error('ERROR posting changelog:', res.status, data);
  }
}

main().catch(console.error);
