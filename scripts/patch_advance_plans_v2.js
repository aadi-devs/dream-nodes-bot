require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

async function patchAdvancePlansV2() {
  const token = process.env.DISCORD_TOKEN;
  const channelId = '1573281486822445128'; // # ♘・ᴀᴅᴠᴀɴᴄᴇ-ᴘʟᴀɴꜱ
  const messageId = '1573688254908207249';
  const budgetPlansChannelId = '1573712408554377336';
  const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
  const budgetPlansUrl = `https://discord.com/channels/1573272872737181696/${budgetPlansChannelId}`;
  const websiteUrl = 'https://dreamnodes.cloud';

  const bannerPath = path.join(__dirname, '..', 'assets', 'advance_plans_banner.jpg');
  if (!fs.existsSync(bannerPath)) {
    throw new Error(`Banner not found: ${bannerPath}`);
  }
  const bannerBuf = fs.readFileSync(bannerPath);

  const containerComponents = [
    // 1. Header
    {
      type: 10,
      content:
        `# ${E.minecraft} **DREAM NODES ┃ Advance Minecraft Hosting**\n` +
        `> ${E.fireWorld} Flagship compute nodes with enterprise Game-Shield DDoS mitigation & 20.0 TPS guarantee.`
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
            url: 'attachment://advance_plans_banner.jpg'
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
    // 5. Game-Shield & Hardware Highlights (Stated once, clean, spacious)
    {
      type: 10,
      content:
        `### ${E.shield} **Enterprise Game-Shield Defense (Included)**\n` +
        `> ${E.attacks} **1.2+ Tbps Automated Filtering:** Layer 4 & Layer 7 scrubbing engineered specifically for Minecraft protocols.\n` +
        `> \n` +
        `> ${E.tick5} **Zero Lag Spikes:** Sub-second mitigation intercepts bot raids, null-pings & SYN storms with zero player disconnects.\n` +
        `> \n` +
        `> ${E.lightning} **Flagship Hardware:** High-frequency performance cores paired with unmetered Gen4 NVMe arrays.`
    },
    // 6. Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // 7. Starter & Small SMP Plans (Spaced with highlighted RAM & Specs)
    {
      type: 10,
      content:
        `### ${E.sparkles} **Starter & Small SMP Tiers**\n` +
        `> ${E.arrowBlue} **Coal • Ember [ 2 GB ]** ➔ ${E.cash} **\`₹200 /mo\`**\n` +
        `> ${E.sparkles} **\`2 GB DDR4\`** ┃ **\`1 CPU Core\`** ┃ **\`15 GB NVMe\`** ┃ \`Game-Shield\`\n` +
        `> \n` +
        `> ${E.arrowBlue} **Copper • Spark [ 4 GB ]** ➔ ${E.cash} **\`₹400 /mo\`**\n` +
        `> ${E.sparkles} **\`4 GB DDR4\`** ┃ **\`1 CPU Core\`** ┃ **\`25 GB NVMe\`** ┃ \`Game-Shield\`\n` +
        `> \n` +
        `> ${E.arrowBlue} **Iron • Flare [ 6 GB ]** ➔ ${E.cash} **\`₹600 /mo\`**\n` +
        `> ${E.sparkles} **\`6 GB DDR4\`** ┃ **\`2 CPU Cores\`** ┃ **\`35 GB NVMe\`** ┃ \`Game-Shield\``
    },
    // 8. Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // 9. Community & Expansion Plans (Spaced with highlighted RAM & Specs)
    {
      type: 10,
      content:
        `### ${E.diamond} **Community & Expansion Tiers**\n` +
        `> ${E.arrowBlue} **Gold • Blaze [ 8 GB ]** ➔ ${E.cash} **\`₹750 /mo\`**\n` +
        `> ${E.diamond} **\`8 GB DDR4\`** ┃ **\`2 CPU Cores\`** ┃ **\`50 GB NVMe\`** ┃ \`Game-Shield\`\n` +
        `> \n` +
        `> ${E.arrowBlue} **Emerald • Aurora [ 12 GB ]** ➔ ${E.cash} **\`₹1,150 /mo\`**\n` +
        `> ${E.diamond} **\`12 GB DDR4\`** ┃ **\`3 CPU Cores\`** ┃ **\`75 GB NVMe\`** ┃ \`Game-Shield\`\n` +
        `> \n` +
        `> ${E.arrowBlue} **Diamond • Nova [ 16 GB ]** ➔ ${E.cash} **\`₹1,500 /mo\`**\n` +
        `> ${E.diamond} **\`16 GB DDR4\`** ┃ **\`4 CPU Cores\`** ┃ **\`100 GB NVMe\`** ┃ \`Game-Shield\``
    },
    // 10. Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // 11. Heavy Modded & Network Flagships (Spaced with highlighted RAM & Specs)
    {
      type: 10,
      content:
        `### ${E.sword} **Heavy Modded & Network Flagships**\n` +
        `> ${E.arrowBlue} **Netherite • Eclipse [ 24 GB ]** ➔ ${E.cash} **\`₹2,250 /mo\`**\n` +
        `> ${E.crownRed} **\`24 GB DDR4\`** ┃ **\`6 CPU Cores\`** ┃ **\`120 GB NVMe\`** ┃ \`Game-Shield\`\n` +
        `> \n` +
        `> ${E.arrowBlue} **Beacon • Zenith [ 32 GB ]** ➔ ${E.cash} **\`₹3,000 /mo\`**\n` +
        `> ${E.crownRed} **\`32 GB DDR4\`** ┃ **\`8 CPU Cores\`** ┃ **\`150 GB NVMe\`** ┃ \`Game-Shield\`\n` +
        `> \n` +
        `> ${E.arrowBlue} **Ender • Galaxy [ 48 GB ]** ➔ ${E.cash} **\`₹4,500 /mo\`**\n` +
        `> ${E.crownRed} **\`48 GB DDR4\`** ┃ **\`12 CPU Cores\`** ┃ **\`220 GB NVMe\`** ┃ \`Game-Shield\`\n` +
        `> \n` +
        `> ${E.arrowBlue} **Dragon • Cosmos [ 64 GB ]** ➔ ${E.cash} **\`₹6,000 /mo\`**\n` +
        `> ${E.crownRed} **\`64 GB DDR4\`** ┃ **\`16 CPU Cores\`** ┃ **\`300 GB NVMe\`** ┃ \`Game-Shield\``
    },
    // 12. Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // 13. Dedicated IPv4 Add-On
    {
      type: 10,
      content:
        `### ${E.world} **Dedicated IPv4 & Default Port Add-On**\n` +
        `> ${E.arrowBlue} **Dedicated Clean IPv4 + Default Port (25565):** ${E.cash} **\`₹350 /mo\`**\n` +
        `> ${E.sparkles} Connect players directly using your custom server domain without typing port numbers!`
    },
    // 14. Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // 15. Action Row
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
          label: 'Budget Plans',
          url: budgetPlansUrl,
          emoji: B.minecraft
        },
        {
          type: 2,
          style: 5,
          label: 'Official Website',
          url: websiteUrl,
          emoji: B.fireWorld
        }
      ]
    },
    // 16. Footer
    {
      type: 10,
      content: `-# ${E.verifiedBlue} Dream Nodes • Enterprise Game-Shield Protected Minecraft Hosting • 99.9% Uptime SLA`
    }
  ];

  const payload = {
    flags: 32768,
    content: '',
    embeds: [],
    attachments: [{ id: 0, filename: 'advance_plans_banner.jpg' }],
    components: [
      {
        type: 17,
        accent_color: null,
        components: containerComponents
      }
    ]
  };

  const formData = new FormData();
  formData.append('files[0]', new File([bannerBuf], 'advance_plans_banner.jpg', { type: 'image/jpeg' }));
  formData.append('payload_json', JSON.stringify(payload));

  console.log(`Patching Advance Plans message ${messageId} in channel ${channelId}...`);
  const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bot ${token}` },
    body: formData
  });

  const data = await res.json();
  if (res.ok) {
    console.log('SUCCESS! Advance Plans message patched with ultra-premium banner & highlighted specs:', data.id);
  } else {
    console.error('FAILED to patch message:', JSON.stringify(data, null, 2));
  }
}

patchAdvancePlansV2().catch(console.error);
