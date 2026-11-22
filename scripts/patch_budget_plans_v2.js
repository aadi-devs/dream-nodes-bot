require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

async function patchBudgetPlansV2() {
  const token = process.env.DISCORD_TOKEN;
  const channelId = '1573712408554377336'; // # ♘・ʙᴜᴅɢᴇᴛ-ᴘʟᴀɴꜱ
  const messageId = '1573738387918299259';
  const advancePlansChannelId = '1573281486822445128';
  const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
  const advancePlansUrl = `https://discord.com/channels/1573272872737181696/${advancePlansChannelId}`;
  const websiteUrl = 'https://dreamnodes.cloud';

  const bannerPath = path.join(__dirname, '..', 'assets', 'budget_plans_banner.jpg');
  if (!fs.existsSync(bannerPath)) {
    throw new Error(`Banner not found: ${bannerPath}`);
  }
  const bannerBuf = fs.readFileSync(bannerPath);

  const containerComponents = [
    // 1. Header
    {
      type: 10,
      content:
        `# ${E.minecraft} **DREAM NODES ┃ Budget Minecraft Plans**\n` +
        `> ${E.sparkles} Maximum resources, dedicated memory, and NVMe performance at pocket-friendly pricing.`
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
            url: 'attachment://budget_plans_banner.jpg'
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
    // 5. Hardware & Node Highlights (Once, uncluttered)
    {
      type: 10,
      content:
        `### ${E.settings} **Hardware & Infrastructure Highlights**\n` +
        `> ${E.tick5} **Control Panel:** Pterodactyl access, SFTP file management & split port allocation.\n` +
        `> ${E.arrowBlue} **Databases & Backups:** Free MySQL databases with automated snapshot recovery.\n` +
        `> ${E.arrowBlue} **Network Protection:** 10 Gbps DDoS mitigation (for high-threat filtering, see <#${advancePlansChannelId}>).`
    },
    // 6. Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // 7. Starter & Creator Plans
    {
      type: 10,
      content:
        `### ${E.lightning} **Starter & Creator Tiers**\n` +
        `> ${E.arrowBlue} **Pro Start [ 8 GB ]** • \`400% CPU\` • \`150 GB NVMe\` ➔ ${E.cash} **₹350 /mo**\n` +
        `> ${E.arrowBlue} **Pro Advance [ 12 GB ]** • \`500% CPU\` • \`200 GB NVMe\` ➔ ${E.cash} **₹525 /mo**\n` +
        `> ${E.arrowBlue} **Pro Plus [ 16 GB ]** • \`600% CPU\` • \`250 GB NVMe\` ➔ ${E.cash} **₹700 /mo**\n` +
        `> ${E.arrowBlue} **Elite [ 24 GB ]** • \`700% CPU\` • \`350 GB NVMe\` ➔ ${E.cash} **₹1,050 /mo**\n` +
        `> ${E.arrowBlue} **Elite Plus [ 32 GB ]** • \`800% CPU\` • \`500 GB NVMe\` ➔ ${E.cash} **₹1,400 /mo**`
    },
    // 8. Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // 9. High-Capacity & Mega Network Plans
    {
      type: 10,
      content:
        `### ${E.rocket} **High-Capacity & Network Tiers**\n` +
        `> ${E.arrowBlue} **Enterprise [ 48 GB ]** • \`1200% CPU\` • \`750 GB NVMe\` ➔ ${E.cash} **₹2,100 /mo**\n` +
        `> ${E.arrowBlue} **Enterprise Plus [ 64 GB ]** • \`1600% CPU\` • \`1 TB NVMe\` ➔ ${E.cash} **₹2,800 /mo**\n` +
        `> ${E.arrowBlue} **Titan [ 128 GB ]** • \`3200% CPU\` • \`2 TB NVMe\` ➔ ${E.cash} **₹5,600 /mo**\n` +
        `> ${E.arrowBlue} **Titan Max [ 256 GB ]** • \`6400% CPU\` • \`4 TB NVMe\` ➔ ${E.cash} **₹11,200 /mo**`
    },
    // 10. Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // 11. Action Row
    {
      type: 1,
      components: [
        {
          type: 2,
          style: 5,
          label: 'Order via Ticket',
          url: ticketChannelUrl,
          emoji: B.ticket
        },
        {
          type: 2,
          style: 5,
          label: 'Advance Plans',
          url: advancePlansUrl,
          emoji: B.minecraft
        },
        {
          type: 2,
          style: 5,
          label: 'Official Website',
          url: websiteUrl,
          emoji: B.world
        }
      ]
    },
    // 12. Footer
    {
      type: 10,
      content: `-# ${E.verifiedBlue} Dream Nodes • High-Resource Budget Minecraft Hosting • Instant Provisioning`
    }
  ];

  const payload = {
    flags: 32768,
    content: '',
    embeds: [],
    attachments: [{ id: 0, filename: 'budget_plans_banner.jpg' }],
    components: [
      {
        type: 17,
        accent_color: null,
        components: containerComponents
      }
    ]
  };

  const formData = new FormData();
  formData.append('files[0]', new File([bannerBuf], 'budget_plans_banner.jpg', { type: 'image/jpeg' }));
  formData.append('payload_json', JSON.stringify(payload));

  console.log(`Patching Budget Plans message ${messageId} in channel ${channelId}...`);
  const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bot ${token}` },
    body: formData
  });

  const data = await res.json();
  if (res.ok) {
    console.log('SUCCESS! Budget Plans message patched with V2 Container & Minecraft Banner:', data.id);
  } else {
    console.error('FAILED to patch message:', JSON.stringify(data, null, 2));
  }
}

patchBudgetPlansV2().catch(console.error);
