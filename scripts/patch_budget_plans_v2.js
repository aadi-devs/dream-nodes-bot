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
        `> ${E.fireWorld} Maximum resources, dedicated memory, and NVMe performance at pocket-friendly pricing.`
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
    // 5. Hardware & Node Highlights (Spaced, highlighted once)
    {
      type: 10,
      content:
        `### ${E.settings} **Hardware & Infrastructure Highlights**\n` +
        `> ${E.tick5} **Control Panel:** Pterodactyl access, SFTP file management & split port allocation.\n` +
        `> \n` +
        `> ${E.arrowBlue} **Databases & Backups:** Free MySQL databases with automated snapshot recovery.\n` +
        `> \n` +
        `> ${E.arrowBlue} **Network Protection:** 10 Gbps DDoS mitigation (for high-threat filtering, see <#${advancePlansChannelId}>).`
    },
    // 6. Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // 7. Starter & Creator Plans (Spaced with highlighted RAM & Specs)
    {
      type: 10,
      content:
        `### ${E.lightning} **Starter & Creator Tiers**\n` +
        `> ${E.arrowBlue} **Pro Start [ 8 GB ]** ➔ ${E.cash} **\`₹350 /mo\`**\n` +
        `> ${E.sparkles} **\`8 GB RAM\`** ┃ **\`400% CPU\`** ┃ **\`150 GB NVMe\`** ┃ **\`1 Gbps\`**\n` +
        `> \n` +
        `> ${E.arrowBlue} **Pro Advance [ 12 GB ]** ➔ ${E.cash} **\`₹525 /mo\`**\n` +
        `> ${E.sparkles} **\`12 GB RAM\`** ┃ **\`500% CPU\`** ┃ **\`200 GB NVMe\`** ┃ **\`1 Gbps\`**\n` +
        `> \n` +
        `> ${E.arrowBlue} **Pro Plus [ 16 GB ]** ➔ ${E.cash} **\`₹700 /mo\`**\n` +
        `> ${E.sparkles} **\`16 GB RAM\`** ┃ **\`600% CPU\`** ┃ **\`250 GB NVMe\`** ┃ **\`1 Gbps\`**\n` +
        `> \n` +
        `> ${E.arrowBlue} **Elite Community [ 24 GB ]** ➔ ${E.cash} **\`₹1,050 /mo\`**\n` +
        `> ${E.sparkles} **\`24 GB RAM\`** ┃ **\`700% CPU\`** ┃ **\`350 GB NVMe\`** ┃ **\`1 Gbps\`**\n` +
        `> \n` +
        `> ${E.arrowBlue} **Elite Plus [ 32 GB ]** ➔ ${E.cash} **\`₹1,400 /mo\`**\n` +
        `> ${E.sparkles} **\`32 GB RAM\`** ┃ **\`800% CPU\`** ┃ **\`500 GB NVMe\`** ┃ **\`1 Gbps\`**`
    },
    // 8. Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // 9. High-Capacity & Network Plans (Spaced with highlighted RAM & Specs)
    {
      type: 10,
      content:
        `### ${E.rocket} **High-Capacity & Network Tiers**\n` +
        `> ${E.arrowBlue} **Enterprise [ 48 GB ]** ➔ ${E.cash} **\`₹2,100 /mo\`**\n` +
        `> ${E.diamond} **\`48 GB RAM\`** ┃ **\`1200% CPU\`** ┃ **\`750 GB NVMe\`** ┃ **\`1 Gbps\`**\n` +
        `> \n` +
        `> ${E.arrowBlue} **Enterprise Plus [ 64 GB ]** ➔ ${E.cash} **\`₹2,800 /mo\`**\n` +
        `> ${E.diamond} **\`64 GB RAM\`** ┃ **\`1600% CPU\`** ┃ **\`1 TB NVMe SSD\`** ┃ **\`1 Gbps\`**\n` +
        `> \n` +
        `> ${E.arrowBlue} **Titan Colossus [ 128 GB ]** ➔ ${E.cash} **\`₹5,600 /mo\`**\n` +
        `> ${E.diamond} **\`128 GB RAM\`** ┃ **\`3200% CPU\`** ┃ **\`2 TB NVMe SSD\`** ┃ **\`1 Gbps\`**\n` +
        `> \n` +
        `> ${E.arrowBlue} **Titan Max [ 256 GB ]** ➔ ${E.cash} **\`₹11,200 /mo\`**\n` +
        `> ${E.diamond} **\`256 GB RAM\`** ┃ **\`6400% CPU\`** ┃ **\`4 TB NVMe SSD\`** ┃ **\`1 Gbps\`**`
    },
    // 10. Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // 11. Dedicated IPv4 Add-On
    {
      type: 10,
      content:
        `### ${E.world} **Dedicated IPv4 & Port Add-On**\n` +
        `> ${E.arrowBlue} **Dedicated IPv4 + Default Port (25565):** ${E.cash} **\`₹350 /mo\`**\n` +
        `> ${E.sparkles} Connect directly using your domain without entering any port numbers!`
    },
    // 12. Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // 13. Action Row
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
          emoji: B.fireWorld
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
    console.log('SUCCESS! Budget Plans updated with highlighted specs and spacing:', data.id);
  } else {
    console.error('FAILED to patch message:', JSON.stringify(data, null, 2));
  }
}

patchBudgetPlansV2().catch(console.error);
