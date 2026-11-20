require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const http = require('http');
const { 
  Client, 
  GatewayIntentBits, 
  ActivityType, 
  SlashCommandBuilder, 
  Routes, 
  REST, 
  EmbedBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID || '1573271779915337811';
const guildId = '1573272872737181696';
const welcomeChannelId = '1573337290502176848';
const honeypotChannelId = '1573337296042729502';
const honeypotMessageId = '1573402481214492685';
const honeypotLogsFile = path.join(__dirname, '..', 'data', 'honeypot_logs.json');

function getHoneypotLogs() {
  try {
    if (fs.existsSync(honeypotLogsFile)) {
      return JSON.parse(fs.readFileSync(honeypotLogsFile, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function addHoneypotLog(entry) {
  try {
    const logs = getHoneypotLogs();
    logs.push(entry);
    const dataDir = path.dirname(honeypotLogsFile);
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(honeypotLogsFile, JSON.stringify(logs, null, 2), 'utf8');
  } catch (e) {
    console.error('[HONEYPOT LOG ERROR]', e);
  }
}

async function updateHoneypotButton() {
  try {
    const logs = getHoneypotLogs();
    const kicksCount = logs.filter(l => l.action === 'KICKED').length;

    const fetchRes = await fetch(`https://discord.com/api/v10/channels/${honeypotChannelId}/messages/${honeypotMessageId}`, {
      headers: { Authorization: `Bot ${token}` }
    });
    if (!fetchRes.ok) return;
    const msg = await fetchRes.json();
    if (!msg.components) return;

    const components = msg.components;
    if (components[0]?.components) {
      const actionRow = components[0].components.find(c => c.type === 1);
      if (actionRow && actionRow.components?.[0]) {
        actionRow.components[0].label = `ᴋɪᴄᴋꜱ: ${kicksCount}`;
        actionRow.components[0].disabled = false;

        await fetch(`https://discord.com/api/v10/channels/${honeypotChannelId}/messages/${honeypotMessageId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bot ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ components, flags: 32768 })
        });
      }
    }
  } catch (err) {
    console.error('[UPDATE HONEYPOT BUTTON ERROR]', err);
  }
}

const permanentInviteUrl = 'https://discord.gg/qKqw393g4E';

async function sendHoneypotAlertDM(userId) {
  try {
    const dmRes = await fetch('https://discord.com/api/v10/users/@me/channels', {
      method: 'POST',
      headers: {
        Authorization: 'Bot ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recipient_id: userId })
    });
    const dmChannel = await dmRes.json();
    if (!dmChannel.id) return false;

    const honeypotPath = path.join(__dirname, '..', 'assets', 'honeypot_3d.png');
    const honeypotBuffer = fs.readFileSync(honeypotPath);

    const payload = {
      flags: 32768,
      attachments: [
        { id: 0, filename: 'honeypot_3d.png' }
      ],
      components: [
        {
          type: 17,
          components: [
            {
              type: 9,
              components: [
                {
                  type: 10,
                  content:
                    '### ✦ ⊘ 🍯 ・ ᴅʀᴇᴀᴍ ɴᴏᴅᴇꜱ ꜱᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ !\n' +
                    '⚠️ ・ **ʏᴏᴜʀ ᴀᴄᴄᴏᴜɴᴛ ᴡᴀꜱ ꜱᴏꜰᴛʙᴀɴɴᴇᴅ / ᴋɪᴄᴋᴇᴅ**\n' +
                    '> ʏᴏᴜʀ ᴀᴄᴄᴏᴜɴᴛ ꜱᴇɴᴛ ᴀ ᴍᴇꜱꜱᴀɢᴇ ɪɴ ᴏᴜʀ **# 𖹭ᐟ・ᴅᴏɴᴛ-ᴍꜱɢ-ʜᴇʀᴇ** ʜᴏɴᴇʏᴘᴏᴛ ᴄʜᴀɴɴᴇʟ .\n' +
                    '> ᴛʜɪꜱ ᴄʜᴀɴɴᴇʟ ɪꜱ ᴅᴇꜱɪɢɴᴇᴅ ᴇxᴄʟᴜꜱɪᴠᴇʟʏ ᴛᴏ ᴛʀᴀᴘ ᴀᴜᴛᴏᴍᴀᴛᴇᴅ ꜱᴘᴀᴍ ʙᴏᴛꜱ & ᴛᴏᴋᴇɴ ɢʀᴀʙʙᴇʀꜱ .\n\n' +
                    '🛡️ ・ **ʜᴏᴡ ᴛᴏ ʀᴇᴄᴏᴠᴇʀ ʏᴏᴜʀ ᴀᴄᴄᴏᴜɴᴛ :**\n' +
                    '> ✦ `1.` **ᴄʜᴀɴɢᴇ ʏᴏᴜʀ ᴅɪꜱᴄᴏʀᴅ ᴘᴀꜱꜱᴡᴏʀᴅ** ɪᴍᴍᴇᴅɪᴀᴛᴇʟʏ (ᴛʜɪꜱ ʀᴇꜱᴇᴛꜱ ʏᴏᴜʀ ᴛᴏᴋᴇɴ) .\n' +
                    '> ✦ `2.` **ᴇɴᴀʙʟᴇ ᴛᴡᴏ-ꜰᴀᴄᴛᴏʀ ᴀᴜᴛʜᴇɴᴛɪᴄᴀᴛɪᴏɴ (2ꜰᴀ)** ꜰᴏʀ ᴍᴀxɪᴍᴜᴍ ꜱᴇᴄᴜʀɪᴛʏ .\n' +
                    '> ✦ `3.` **ᴄʜᴇᴄᴋ ᴀᴜᴛʜᴏʀɪᴢᴇᴅ ᴀᴘᴘꜱ** (ꜱᴇᴛᴛɪɴɢꜱ → ᴀᴜᴛʜᴏʀɪᴢᴇᴅ ᴀᴘᴘꜱ) ᴀɴᴅ ʀᴇᴠᴏᴋᴇ ꜱᴜꜱᴘɪᴄɪᴏᴜꜱ ᴏɴᴇꜱ .\n\n' +
                    '✨ ・ **ᴊᴏɪɴ ᴜꜱ ʙᴀᴄᴋ ᴏɴᴄᴇ ʏᴏᴜ ᴀʀᴇ ꜱᴇᴄᴜʀᴇ :**\n' +
                    '> ᴏɴᴄᴇ ʏᴏᴜ ʜᴀᴠᴇ ꜱᴇᴄᴜʀᴇᴅ ʏᴏᴜʀ ᴀᴄᴄᴏᴜɴᴛ , ʏᴏᴜ ᴀʀᴇ ᴍᴏʀᴇ ᴛʜᴀɴ ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ʀᴇᴊᴏɪɴ ᴏᴜʀ ᴄᴏᴍᴍᴜɴɪᴛʏ !'
                }
              ],
              accessory: {
                type: 11,
                media: {
                  url: 'attachment://honeypot_3d.png'
                }
              }
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
                  type: 2,
                  style: 5,
                  label: '✦ ʀᴇᴊᴏɪɴ ᴅʀᴇᴀᴍ ɴᴏᴅᴇꜱ ✦',
                  url: permanentInviteUrl,
                  emoji: { name: '🕊' }
                },
                {
                  type: 2,
                  style: 5,
                  label: 'ꜱᴀꜰᴇᴛʏ ɢᴜɪᴅᴇ',
                  url: 'https://support.discord.com/hc/en-us/articles/24160905096599-Keeping-Your-Discord-Account-Safe',
                  emoji: { name: '🛡️' }
                }
              ]
            },
            {
              type: 10,
              content: '-# ୨୧ ・ Dʀᴇᴀᴍ Nᴏᴅᴇs • ᴀᴜᴛᴏᴍᴀᴛᴇᴅ ꜱᴇɴᴛɪɴᴇʟ ᴅᴇꜰᴇɴꜱᴇ <3'
            }
          ]
        }
      ]
    };

    const formData = new FormData();
    formData.append('payload_json', JSON.stringify(payload));
    formData.append('files[0]', new File([honeypotBuffer], 'honeypot_3d.png', { type: 'image/png' }));

    const res = await fetch(`https://discord.com/api/v10/channels/${dmChannel.id}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bot ${token}` },
      body: formData
    });

    const data = await res.json();
    return !!data.id;
  } catch (err) {
    console.error('[HONEYPOT DM ERROR]', err);
    return false;
  }
}

if (!token) {
  console.error("Missing DISCORD_TOKEN in environment");
  process.exit(1);
}

// ── Vercel HTTP Health-Check Server (Port 80/3000) ──
const port = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'ONLINE',
    project: 'Dream Nodes Discord Bot',
    bot: client.user ? client.user.tag : 'connecting',
    ping: client.ws ? `${client.ws.ping}ms` : 'N/A',
    uptime: `${(process.uptime() / 3600).toFixed(2)}h`
  }));
});

server.listen(port, () => {
  console.log(`[HTTP SERVER] Health check listening on port ${port}`);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// Slash Commands Definition
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot and Discord Gateway latency'),

  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Display Dream Nodes infrastructure and node health'),

  new SlashCommandBuilder()
    .setName('plans')
    .setDescription('Browse Dream Nodes server and VPS hosting plans'),

  new SlashCommandBuilder()
    .setName('testwelcome')
    .setDescription('Preview the animated welcome message in the welcome channel')
].map(cmd => cmd.toJSON());

// Register Slash Commands
async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(token);
  try {
    console.log('Registering slash commands for guild...');
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log('Successfully registered slash commands.');
  } catch (err) {
    console.error('Error registering commands:', err);
  }
}

// Function to send modern Components V2 welcome container
async function sendWelcomeV2(targetChannelId, member) {
  const logoPath = path.join(__dirname, '..', 'assets', 'logo.jpg');
  const bannerPath = path.join(__dirname, '..', 'assets', 'welcome_banner_animated.gif');

  const logoBuffer = fs.readFileSync(logoPath);
  const bannerBuffer = fs.readFileSync(bannerPath);

  const count = member?.guild?.memberCount || 2;
  const username = member?.user?.tag || member?.user?.username || 'member';
  const memberId = member?.id || member?.user?.id;

  const payload = {
    flags: 32768, // IS_COMPONENTS_V2
    attachments: [
      { id: 0, filename: 'logo.jpg' },
      { id: 1, filename: 'welcome_banner.gif' }
    ],
    components: [
      ...(memberId ? [{ type: 10, content: `<@${memberId}>` }] : []),
      {
        type: 17, // Container without accent_color (seamless borderless)
        components: [
          {
            type: 9, // Section
            components: [
              {
                type: 10,
                content:
                  `${username}\n` +
                  `### ✦ ε 🕊 ・ ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ᴅʀᴇᴀᴍ ɴᴏᴅᴇꜱ !\n` +
                  `🧦 ・ ꜱᴀʏ ʜɪ ɪɴ <#1573281610210611266> ˚ ˖ ! ୨୧\n` +
                  `→ ・ ✩ ・ ʀᴇᴀᴅ ᴛʜᴇ <#1573337303538208778> !\n` +
                  `: 🧷 ‹3 ・ ꜱᴇʀᴠᴇʀ ᴜᴘᴅᴀᴛᴇꜱ ɪɴ <#1573337308529434756> ୨୧ ! ˚\n` +
                  `・ ✧ ・ ᴇxᴘʟᴏʀᴇ ʜᴏꜱᴛɪɴɢ ɪɴ <#1573281486822445128> ୨୧ !`
              }
            ],
            accessory: {
              type: 11, // Thumbnail
              media: {
                url: 'attachment://logo.jpg'
              }
            }
          },
          {
            type: 14, // Separator
            divider: true,
            spacing: 1
          },
          {
            type: 12, // MediaGallery
            items: [
              {
                media: {
                  url: 'attachment://welcome_banner.gif'
                }
              }
            ]
          },
          {
            type: 10, // Footer
            content: `-# ᴡᴇ ɴᴏᴡ ʜᴀᴠᴇ ${count} ᴍᴇᴍʙᴇʀꜱ! <3`
          }
        ]
      }
    ]
  };

  const formData = new FormData();
  formData.append('payload_json', JSON.stringify(payload));
  formData.append('files[0]', new File([logoBuffer], 'logo.jpg', { type: 'image/jpeg' }));
  formData.append('files[1]', new File([bannerBuffer], 'welcome_banner.gif', { type: 'image/gif' }));

  const res = await fetch(`https://discord.com/api/v10/channels/${targetChannelId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bot ${token}` },
    body: formData
  });

  return await res.json();
}

client.once('clientReady', async () => {
  console.log(`[BOT READY] Logged in as ${client.user.tag} (${client.user.id})`);

  // Set presence to: developing solutions
  client.user.setPresence({
    status: 'online',
    activities: [
      {
        name: 'developing solutions',
        type: ActivityType.Custom,
        state: 'developing solutions'
      }
    ]
  });

  console.log(`[PRESENCE SET] Activity set to "developing solutions"`);
  await registerCommands();
});

// Automatic Welcome Message on Member Join
client.on('guildMemberAdd', async member => {
  try {
    console.log(`[MEMBER JOINED] ${member.user.tag} joined ${member.guild.name}`);
    const channel = await member.guild.channels.fetch(welcomeChannelId).catch(() => null) ||
                    member.guild.channels.cache.get(welcomeChannelId);

    if (channel) {
      const res = await sendWelcomeV2(channel.id, member);
      if (res.id) {
        console.log(`[WELCOME SENT] Sent Components V2 welcome container for ${member.user.tag} (Message ID: ${res.id})`);
      } else {
        console.error(`[WELCOME ERROR] Discord API error:`, res);
      }
    } else {
      console.warn(`[WELCOME WARN] Welcome channel (${welcomeChannelId}) not found.`);
    }
  } catch (err) {
    console.error(`[WELCOME ERROR] Failed to send welcome message:`, err);
  }
});

// Honeypot Protection: Auto-kick & delete anyone messaging in dont-msg-here
client.on('messageCreate', async message => {
  if (message.channelId === honeypotChannelId) {
    if (message.author.id === client.user.id) return;

    const userTag = message.author.tag || message.author.username;
    const userId = message.author.id;
    const contentSnippet = message.content ? message.content.slice(0, 80) : '[Attachment/Embed]';
    const timestamp = Math.floor(Date.now() / 1000);

    let actionStatus = 'KICKED';
    let failReason = null;

    try {
      // 1. Notify user in DM with aesthetic Components V2 recovery guide & permanent invite link
      await sendHoneypotAlertDM(userId).catch(err => {
        console.error('[HONEYPOT DM ERROR]', err);
      });

      // 2. Delete message immediately
      await message.delete().catch(() => null);

      if (message.member) {
        if (message.member.permissions.has('Administrator')) {
          actionStatus = 'IMMUNE_ADMIN';
          failReason = 'User is Administrator (cannot kick)';
          console.log(`[HONEYPOT] User ${userTag} is Administrator - deleted message but spared kick.`);
        } else if (!message.member.kickable) {
          actionStatus = 'IMMUNE_HIERARCHY';
          failReason = 'Higher or equal role hierarchy (cannot kick)';
          console.log(`[HONEYPOT] User ${userTag} has higher role hierarchy - deleted message.`);
        } else {
          await message.member.kick('Honeypot triggered: Sent message in #𖹭ᐟ・ᴅᴏɴᴛ-ᴍꜱɢ-ʜᴇʀᴇ');
          actionStatus = 'KICKED';
          console.log(`[HONEYPOT] Deleted message and kicked ${userTag} (${userId})`);
        }
      } else {
        actionStatus = 'KICKED';
      }
    } catch (err) {
      actionStatus = 'FAILED_ERROR';
      failReason = err.message || 'Permission error';
      console.error('[HONEYPOT ERROR]', err);
    }

    addHoneypotLog({
      timestamp,
      userTag,
      userId,
      action: actionStatus,
      failReason,
      contentSnippet
    });

    await updateHoneypotButton();
  }
});

// Handle Interactions
client.on('interactionCreate', async interaction => {
  // Handle Honeypot Kicks Button Click
  if (interaction.isButton()) {
    if (interaction.customId === 'honeypot_kicks_display') {
      const logs = getHoneypotLogs();
      const totalKicks = logs.filter(l => l.action === 'KICKED').length;
      const totalAttempts = logs.length;
      const immuneCount = logs.filter(l => l.action.startsWith('IMMUNE') || l.action.startsWith('FAILED')).length;

      const embed = new EmbedBuilder()
        .setTitle('✦ 🍯 ・ ʜᴏɴᴇʏᴘᴏᴛ ꜱᴇᴄᴜʀɪᴛʏ & ᴋɪᴄᴋ ʜɪꜱᴛᴏʀʏ')
        .setColor([55, 55, 61])
        .setDescription(
          `📊 **ᴛᴏᴛᴀʟ ᴛʀɪɢɢᴇʀꜱ:** \`${totalAttempts}\` ┃ 🟢 **ꜱᴏꜰᴛʙᴀɴꜱ / ᴋɪᴄᴋꜱ:** \`${totalKicks}\` ┃ 🛡️ **ɪᴍᴍᴜɴᴇ:** \`${immuneCount}\`\n\n` +
          `### 📜 ʀᴇᴄᴇɴᴛ ɪɴᴄɪᴅᴇɴᴛ ʜɪꜱᴛᴏʀʏ\n` +
          (logs.length === 0
            ? '`No honeypot violations recorded yet. Server is clean and secure!`'
            : logs.slice(-8).reverse().map((entry, idx) => {
                const time = `<t:${entry.timestamp}:R>`;
                if (entry.action === 'KICKED') {
                  return `**${idx + 1}.** 🟢 **ᴋɪᴄᴋᴇᴅ:** \`${entry.userTag}\` (<@${entry.userId}>) • ${time}\n` +
                         `> 💬 *"${entry.contentSnippet}"*`;
                } else {
                  return `**${idx + 1}.** ⚠️ **ꜰᴀɪʟᴇᴅ (ʜɪɢʜᴇʀ ᴘᴇʀᴍꜱ):** \`${entry.userTag}\` (<@${entry.userId}>) • ${time}\n` +
                         `> 🛡️ *${entry.failReason || 'Administrator / Role Hierarchy'}*\n` +
                         `> 💬 *"${entry.contentSnippet}"*`;
                }
              }).join('\n\n'))
        )
        .setFooter({ text: 'Dʀᴇᴀᴍ Nᴏᴅᴇs • Honeypot Sentinel Security' })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: true // Dismissable hidden message
      });
    }
    return;
  }

  // Handle Terms of Service / Policy Dropdown Select Menu
  if (interaction.isStringSelectMenu() && interaction.customId === 'tos_select_menu') {
    const selected = interaction.values[0];
    let contentBody = '';
    let footerTag = '';

    if (selected === 'tos_refund') {
      contentBody =
        '# <a:cash:1573382269735805008> Dream Nodes | Official Refund Policy\n\n' +
        '## <a:hostinger:1573382335355691089> 24-Hour Money-Back Guarantee\n' +
        '> <a:sparkles_sparkles:1573382447603785928> We offer a **24-hour refund window** for first-time Minecraft and VPS hosting purchases if you encounter node-side technical problems or network outages that our support team is unable to resolve within a reasonable timeframe.\n\n' +
        '## <a:Tick5:1573382205395177532> Eligibility & Requirements\n' +
        '> ✦ **Ticket Requirement:** All refund requests must be initiated via an official support ticket in <#1573281601775870043> within **24 hours** of the initial invoice payment.\n' +
        '> \n' +
        '> ✦ **First-Time Orders:** The guarantee applies strictly to your initial service setup to prevent service cycling or abuse.\n' +
        '> \n' +
        '> ✦ **Payout Options:** Eligible refunds can be sent back to the original payment method, or credited to your Dream Nodes account balance with an **extra +10% bonus credit**.\n\n' +
        '## <a:Cross:1573382156296917032> Non-Refundable Products & Exceptions\n' +
        '> ⊘ **Domain Registrations & Transfers:** Due to upstream registry processing fees, domains cannot be cancelled or refunded once registered.\n' +
        '> \n' +
        '> ⊘ **Dedicated Hardware:** Custom bare-metal servers, GPU instances, and custom enterprise deployments.\n' +
        '> \n' +
        '> ⊘ **Crypto Payments:** Due to market volatility, payments made in cryptocurrency are non-refundable to wallets (eligible only as account store credit).\n' +
        '> \n' +
        '> ⊘ **Abuse & TOS Terminations:** Any service suspended or terminated for violating our Acceptable Use Policy (DDoS, mining, spam, etc.) automatically forfeits all refund rights.\n\n' +
        '## <a:fsk_warning:1573382318364692703> Disputes & Chargebacks\n' +
        '> ⚠️ Filing an unauthorized PayPal dispute, credit card chargeback, or bank reversal without contacting support first will result in **immediate permanent server termination**, account blacklisting, and loss of all server files.';
      footerTag = '-# 💙 Dream Nodes • Official Refund & Billing Agreement';
    } else if (selected === 'tos_vps') {
      contentBody =
        '# <:vps:1573382507863220246> Dream Nodes | VPS & Cloud Policies\n\n' +
        '## <:cpu:1573382485310709781> Fair-Use & Resource Quotas\n' +
        '> <a:hostinger:1573382335355691089> All Virtual Private Servers and RDPs run on enterprise Intel Xeon / AMD EPYC processors backed by Gen4 NVMe arrays. To ensure uninterrupted performance across all neighbor instances, shared-thread nodes follow fair-use resource allocation.\n\n' +
        '## <a:Tick5:1573382205395177532> Permitted Use Cases\n' +
        '> ✦ **Game & Bot Hosting:** Running Discord bots, Minecraft networks, FiveM servers, CS2 servers, and backend APIs.\n' +
        '> \n' +
        '> ✦ **Development & CI/CD:** Docker containers, software compilation, web hosting (Nginx/Apache), and personal databases.\n' +
        '> \n' +
        '> ✦ **Personal VPNs:** Private WireGuard or OpenVPN tunnels for personal privacy.\n' +
        '> \n' +
        '> ✦ **Full Root / Administrator:** Complete SSH / RDP control over your environment and operating system.\n\n' +
        '## <a:Cross:1573382156296917032> Prohibited Activities (Zero Tolerance)\n' +
        '> ⊘ **Cryptocurrency Mining:** Any CPU/GPU mining (Monero, Bitcoin, Ravencoin, etc.) results in immediate termination with no refund.\n' +
        '> \n' +
        '> ⊘ **Network Attacks & Stressers:** Initiating or participating in DDoS/DoS attacks, botnet controllers, or IP flooders.\n' +
        '> \n' +
        '> ⊘ **Port Scanning & Exploitation:** Probing IP ranges, vulnerability scanning, or brute-forcing SSH/RDP/FTP credentials.\n' +
        '> \n' +
        '> ⊘ **Tor & Open Relays:** Operating public Tor exit nodes, open proxies, or malicious redirection services.\n' +
        '> \n' +
        '> ⊘ **Mass Mailers (Spam):** Outbound SMTP port 25 is blocked by default across all VPS nodes to prevent email spam.\n\n' +
        '## <a:siren:1573382431065509981> Automated Node Defense\n' +
        '> 🛡️ Automated network filters monitor for abnormal outgoing traffic spikes. Instances engaging in attacks are frozen instantly by our automated sentinels.';
      footerTag = '-# 💙 Dream Nodes • Cloud VPS & Compute Standards';
    } else if (selected === 'tos_mc') {
      contentBody =
        '# <a:minecraft:1573382379215659081> Dream Nodes | Minecraft Hosting Policies\n\n' +
        '## <a:hostinger:1573382335355691089> Game Server Architecture\n' +
        '> <a:Lightning:1573382171257737317> Dream Nodes Minecraft instances are built on high single-core frequency processors and enterprise NVMe storage to guarantee 20 TPS, zero hitching, and rapid chunk loading.\n\n' +
        '## <a:Tick5:1573382205395177532> Included Features & Benefits\n' +
        '> ✦ **Unmetered NVMe SSD Storage:** Fair-use storage for world saves, modpacks, plugins, and server logs.\n' +
        '> \n' +
        '> ✦ **Automated DDoS Shielding:** Enterprise Layer 4 and Layer 7 filtration engineered specifically for Minecraft packet protocols (preventing ping attacks and null-ping boots).\n' +
        '> \n' +
        '> ✦ **SFTP & Custom JARs:** Full access to upload any custom software including Paper, Purpur, Fabric, Forge, NeoForge, Velocity, and BungeeCord.\n' +
        '> \n' +
        '> ✦ **Automated Backups:** Daily snapshots stored off-node for easy world recovery.\n\n' +
        '## <a:fsk_warning:1573382318364692703> Server Guidelines & Prohibitions\n' +
        '> ⊘ **Intentional Node Lag Machines:** Building deliberate redstone or entity loop lag contraptions intended to degrade node stability is forbidden.\n' +
        '> \n' +
        '> ⊘ **Cracked / Backdoored Plugins:** Uploading malware-infected plugins or leaking server credentials puts your service at risk and leads to suspension.\n' +
        '> \n' +
        '> ⊘ **Backup Responsibility:** While we maintain automated server snapshots, clients are encouraged to download local copies prior to major modpack migrations.';
      footerTag = '-# 💙 Dream Nodes • Game Server Policies';
    } else if (selected === 'tos_general') {
      contentBody =
        '# <a:membership:1573382371699458201> Dream Nodes | General Terms of Service\n\n' +
        '## <a:hostinger:1573382335355691089> Official Service Agreement\n' +
        '> <a:membership:1573382371699458201> By purchasing, leasing, or using any service provided by Dream Nodes, you contractually agree to comply with all terms laid out in this agreement.\n\n' +
        '## <a:Tick5:1573382205395177532> Account Ownership & Billing Cycles\n' +
        '> ✦ **Age Requirement:** Clients must be at least 13 years old or have explicit authorization from a parent or legal guardian.\n' +
        '> \n' +
        '> ✦ **Invoicing:** Renewal invoices are issued 7 days before the service due date. Reminders are dispatched via email and Discord.\n' +
        '> \n' +
        '> ✦ **Grace Period & Suspension:** Unpaid invoices result in service suspension after **48 hours** past due.\n' +
        '> \n' +
        '> ✦ **Data Termination:** Suspended services that remain unpaid for **7 consecutive days** are permanently deleted and cannot be recovered.\n\n' +
        '## <a:Lightning:1573382171257737317> Uptime SLA & Service Continuity\n' +
        '> ✦ **99.9% Network Guarantee:** We strive for continuous operational uptime. In the event of unforeseen node hardware failure exceeding SLA terms, service credits may be granted upon request.\n' +
        '> \n' +
        '> ✦ **Scheduled Maintenance:** Routine hardware upgrades and kernel updates are announced in advance in <#1573281463858630726>.';
      footerTag = '-# 💙 Dream Nodes • Master Terms of Service';
    } else if (selected === 'tos_discord') {
      contentBody =
        '# <a:discord_discord:1573382300283179030> Dream Nodes | Community & Support Rules\n\n' +
        '## <a:chat:1573382277164040214> Support Ticket Conduct\n' +
        '> <a:hostinger:1573382335355691089> Our staff and technical support team work around the clock to provide swift assistance for sales, billing, and technical queries.\n\n' +
        '## <a:Tick5:1573382205395177532> How to Open a Ticket\n' +
        '> ✦ **Official Channel:** Open tickets solely through <#1573281601775870043>. Never DM staff members for official technical support.\n' +
        '> \n' +
        '> ✦ **Include Details:** State your service ID, node location, and a detailed description of the error to speed up resolution.\n' +
        '> \n' +
        '> ✦ **No Staff Pings:** Pinging staff members inside or outside tickets will not accelerate your ticket and may result in a warning.\n' +
        '> \n' +
        '> ✦ **Duplicate Tickets:** Opening multiple tickets for the same inquiry is prohibited and leads to a ticket blacklist.\n\n' +
        '## <a:Cross:1573382156296917032> Server Community Standards\n' +
        '> ⊘ **No Toxicity or Harassment:** Respect every member in public channels and voice lounges.\n' +
        '> \n' +
        '> ⊘ **No Unsolicited Advertising:** Direct messaging members to sell hosting, services, or bot invites is strictly prohibited.\n' +
        '> \n' +
        '> ⊘ **No Credential Sharing:** Never share server passwords, SSH keys, or panel tokens in public chat channels.';
      footerTag = '-# 💙 Dream Nodes • Community & Ticket Guidelines';
    }

    const v2Container = {
      flags: 32832, // IS_COMPONENTS_V2 (32768) | EPHEMERAL (64)
      components: [
        {
          type: 17, // Borderless Container
          components: [
            {
              type: 10,
              content: contentBody
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
                  type: 2,
                  style: 5,
                  label: 'Open Support Ticket',
                  url: 'https://discord.com/channels/1573272872737181696/1573281601775870043',
                  emoji: { name: '🎫' }
                },
                {
                  type: 2,
                  style: 5,
                  label: 'Permanent Invite',
                  url: permanentInviteUrl,
                  emoji: { name: '🕊' }
                }
              ]
            },
            {
              type: 10,
              content: footerTag
            }
          ]
        }
      ]
    };

    await interaction.reply(v2Container);
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    const wsPing = client.ws.ping;
    await interaction.reply({
      content: `🏓 **Pong!** Gateway Latency: \`${wsPing}ms\``,
      ephemeral: true
    });
  }

  else if (commandName === 'status') {
    const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
    const uptimeHours = (process.uptime() / 3600).toFixed(1);

    const embed = new EmbedBuilder()
      .setTitle('✦ Dʀᴇᴀᴍ Nᴏᴅᴇs ┃ Iɴꜰʀᴀꜱᴛʀᴜᴄᴛᴜʀᴇ Sᴛᴀᴛᴜꜱ')
      .setColor(0x00f0ff)
      .setDescription('Live operational telemetry for Dream Nodes hosting systems.')
      .addFields(
        { name: '🟢 Core Systems', value: '`ALL OPERATIONAL (100%)`', inline: true },
        { name: '⚡ Gateway Ping', value: `\`${client.ws.ping}ms\``, inline: true },
        { name: '⏱️ Bot Uptime', value: `\`${uptimeHours}h\``, inline: true },
        { name: '🖥️ Compute Nodes', value: '• **Node-US-East**: `Operational`\n• **Node-EU-Central**: `Operational`\n• **Node-SG-Asia**: `Operational`', inline: false },
        { name: '🛡️ DDoS Shield', value: '`Active • Layer 3/4/7 Scrubbing`', inline: true },
        { name: '💾 Storage Layer', value: '`NVMe Gen4 Enterprise RAID-10`', inline: true }
      )
      .setFooter({ text: 'Dʀᴇᴀᴍ Nᴏᴅᴇs • developing solutions' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  else if (commandName === 'plans') {
    const embed = new EmbedBuilder()
      .setTitle('✦ Dʀᴇᴀᴍ Nᴏᴅᴇs ┃ Hᴏꜱᴛɪɴɢ Pʟᴀɴꜱ')
      .setColor(0x9d00ff)
      .setDescription('Explore our high-performance cloud compute, VPS, and game servers.')
      .addFields(
        { name: '🐴 Minecraft Plans', value: 'Check out <#1573281486822445128> for Intel & AMD Ryzen 9 nodes.', inline: false },
        { name: '⚡ VPS / VDS Plans', value: 'Check out <#1573281509140336816> for AMD EPYC & Intel Xeon servers.', inline: false },
        { name: '🎫 Need a Custom Spec?', value: 'Head over to <#1573281601775870043> to create a ticket.', inline: false }
      )
      .setFooter({ text: 'Dʀᴇᴀᴍ Nᴏᴅᴇs • Premium Hosting' });

    await interaction.reply({ embeds: [embed] });
  }

  else if (commandName === 'testwelcome') {
    const targetChannel = interaction.guild.channels.cache.get(welcomeChannelId) || interaction.channel;
    await sendWelcomeV2(targetChannel.id, interaction.member);
    await interaction.reply({
      content: `✓ Sent preview Components V2 welcome message to <#${targetChannel.id}>!`,
      ephemeral: true
    });
  }
});

client.login(token);
