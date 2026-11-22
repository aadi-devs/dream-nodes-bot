require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { E, B } = require('../src/emojis');

async function patchHoneypotV2() {
  const token = process.env.DISCORD_TOKEN;
  const honeypotChannelId = '1573337296042729502';
  const honeypotMessageId = '1573402481214492685';

  const logsFile = path.join(__dirname, '..', 'data', 'honeypot_logs.json');
  let kicksCount = 0;
  try {
    if (fs.existsSync(logsFile)) {
      const logs = JSON.parse(fs.readFileSync(logsFile, 'utf8') || '[]');
      kicksCount = logs.filter(l => l.action === 'KICKED').length;
    }
  } catch (e) {
    console.error('Error reading honeypot logs:', e);
  }

  const bannerPath = path.join(__dirname, '..', 'assets', 'honeypot_banner.jpg');
  if (!fs.existsSync(bannerPath)) {
    throw new Error(`Banner file not found at: ${bannerPath}`);
  }
  const bannerBuf = fs.readFileSync(bannerPath);

  const containerComponents = [
    // Header
    {
      type: 10,
      content: `# ${E.security} **DREAM NODES ┃ Sentinel Defense**\n> ${E.sparkles} Automated perimeter defense and intrusion isolation protocol.`
    },
    // Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // Banner (Media Gallery)
    {
      type: 12,
      items: [
        {
          media: {
            url: 'attachment://honeypot_banner.jpg'
          }
        }
      ]
    },
    // Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // Warning Section
    {
      type: 10,
      content:
        `### ${E.stopSign} **Restricted Area — Do Not Message**\n` +
        `> This channel operates as an automated sentinel trap designed to identify and isolate malicious bots, scrapers, and raid scripts.\n` +
        `> \n` +
        `> ${E.alert} **Strict Notice:** Any message sent in this channel triggers an **instant automated softban** and purges the message.`
    },
    // Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // Navigation Section
    {
      type: 10,
      content:
        `### ${E.chat} **Looking to Chat or Need Assistance?**\n` +
        `> If you are a genuine community member or customer, please navigate to our official channels:\n` +
        `> \n` +
        `> ${E.arrowBlue} **Community Chat:** Hang out with fellow server owners and developers in <#1574120435828662512>.\n` +
        `> ${E.arrowBlue} **Support Desk:** Open a 24/7 technical inquiry or billing ticket in <#1573281601775870043>.\n` +
        `> ${E.arrowBlue} **Community Guidelines:** Review our server rules and terms of service in <#1573281463858630726>.`
    },
    // Divider
    {
      type: 14,
      divider: true,
      spacing: 1
    },
    // Action Row / Buttons
    {
      type: 1,
      components: [
        {
          type: 2,
          custom_id: 'honeypot_kicks_display',
          style: 2,
          label: `Traps Triggered: ${kicksCount}`,
          emoji: B.hammer
        },
        {
          type: 2,
          style: 5,
          label: 'General Chat',
          url: 'https://discord.com/channels/1573272872737181696/1574120435828662512',
          emoji: B.chat
        },
        {
          type: 2,
          style: 5,
          label: 'Support Desk',
          url: 'https://discord.com/channels/1573272872737181696/1573281601775870043',
          emoji: B.ticket
        }
      ]
    },
    // Footer
    {
      type: 10,
      content: `-# ${E.verifiedBlue} Dream Nodes • Automated Security Sentinel • Zero Spam Tolerance`
    }
  ];

  const payload = {
    flags: 32768,
    content: '',
    embeds: [],
    attachments: [{ id: 0, filename: 'honeypot_banner.jpg' }],
    components: [
      {
        type: 17,
        components: containerComponents
      }
    ]
  };

  const formData = new FormData();
  formData.append('files[0]', new File([bannerBuf], 'honeypot_banner.jpg', { type: 'image/jpeg' }));
  formData.append('payload_json', JSON.stringify(payload));

  console.log(`Patching Honeypot message ${honeypotMessageId} in channel ${honeypotChannelId}...`);
  const res = await fetch(`https://discord.com/api/v10/channels/${honeypotChannelId}/messages/${honeypotMessageId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bot ${token}` },
    body: formData
  });

  const data = await res.json();
  if (res.ok) {
    console.log('SUCCESS! Honeypot message patched with V2 Container & Sentinel Banner:', data.id);
  } else {
    console.error('FAILED to patch message:', JSON.stringify(data, null, 2));
  }
}

patchHoneypotV2().catch(console.error);
