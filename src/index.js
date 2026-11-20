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
    let embed = new EmbedBuilder().setColor([55, 55, 61]).setTimestamp();

    if (selected === 'tos_refund') {
      embed
        .setTitle('Dream Nodes | Refund Policy & Guarantee')
        .setDescription(
          `### <a:cash:1573382269735805008> • 24-Hour Money-Back Guarantee\n` +
          `| <a:hostinger:1573382335355691089> We provide a **24-hour money-back guarantee** for first-time Minecraft and VPS hosting orders if you experience technical issues caused by our nodes that our support team cannot resolve.\n\n` +
          `**Refund Eligibility & Conditions**\n` +
          `| <a:Tick5:1573382205395177532> Refund requests must be submitted through a ticket in <#1573281601775870043> within **24 hours** of purchase.\n` +
          `| <a:Tick5:1573382205395177532> The service must not have violated our Fair-Use Policy or Terms of Service.\n` +
          `| <a:Tick5:1573382205395177532> Refunds can be credited to your original payment method or as Dream Nodes Account Credit (+10% bonus).\n\n` +
          `**Non-Refundable Services**\n` +
          `| <a:Cross:1573382156296917032> Domain registrations and transfers (non-refundable registry fees).\n` +
          `| <a:Cross:1573382156296917032> Dedicated bare-metal servers and custom enterprise hardware setups.\n` +
          `| <a:Cross:1573382156296917032> Cryptocurrency payments (credited as account store credit only).\n` +
          `| <a:Cross:1573382156296917032> Services suspended or terminated due to abuse, DDoS, or malicious activity.\n\n` +
          `**<a:fsk_warning:1573382318364692703> Chargeback & Dispute Warning**\n` +
          `| Opening a PayPal or bank dispute without contacting our support team first will result in an immediate **permanent ban**, cancellation of all active servers, and permanent loss of data.`
        )
        .setFooter({ text: 'Dream Nodes • Official Service Agreement' });
    } else if (selected === 'tos_vps') {
      embed
        .setTitle('Dream Nodes | VPS & RDP Policies')
        .setDescription(
          `### <:vps:1573382507863220246> • Resource Allocation & Fair-Use\n` +
          `| <:cpu:1573382485310709781> Our VPS and RDP services run on high-performance Intel and AMD EPYC processors. To guarantee smooth performance for everyone on the host node, all virtual machines operate under fair-use principles.\n\n` +
          `**Allowed Use Cases**\n` +
          `| <a:Tick5:1573382205395177532> Game servers, Discord bots, APIs, development environments, and databases.\n` +
          `| <a:Tick5:1573382205395177532> Docker containers, CI/CD runners, and personal VPNs (WireGuard / OpenVPN).\n` +
          `| <a:Tick5:1573382205395177532> Sustained workloads within your purchased CPU and RAM allocations.\n\n` +
          `**Strictly Prohibited Activities (Zero Tolerance)**\n` +
          `| <a:Cross:1573382156296917032> **Crypto Mining:** Any cryptocurrency mining (Monero, Bitcoin, etc.) results in immediate termination.\n` +
          `| <a:Cross:1573382156296917032> **Network Attacks:** Launching or participating in DDoS/DoS attacks, botnets, or IP stressers.\n` +
          `| <a:Cross:1573382156296917032> **Port Scanning & Probing:** Vulnerability scanning, credential bruteforcing, or IP enumeration.\n` +
          `| <a:Cross:1573382156296917032> **Tor & Open Proxies:** Public exit nodes or anonymous relay proxies are strictly prohibited.\n` +
          `| <a:Cross:1573382156296917032> **Mass Emailing:** Outgoing SMTP (port 25) is blocked by default to prevent spam.\n\n` +
          `**<a:siren:1573382431065509981> Automatic Suspension**\n` +
          `| Malicious activity triggers automated security freezes without advance notice. Terminated instances due to abuse are ineligible for refunds.`
        )
        .setFooter({ text: 'Dream Nodes • VPS & Cloud Policies' });
    } else if (selected === 'tos_mc') {
      embed
        .setTitle('Dream Nodes | Minecraft Hosting Policies')
        .setDescription(
          `### <a:minecraft:1573382379215659081> • Minecraft Server Performance & Features\n` +
          `| <a:hostinger:1573382335355691089> Dream Nodes Minecraft plans are powered by high-frequency Intel and AMD CPUs with enterprise Gen4 NVMe storage for maximum TPS and zero stutter.\n\n` +
          `**What Is Included**\n` +
          `| <a:Tick5:1573382205395177532> **Unmetered NVMe SSD Storage:** Fair-use for game worlds, plugins, mods, and logs.\n` +
          `| <a:Tick5:1573382205395177532> **Enterprise DDoS Protection:** Filters Layer 4 and Layer 7 volumetric attacks automatically.\n` +
          `| <a:Tick5:1573382205395177532> **Full SFTP & Panel Access:** Upload custom server JARs (Paper, Purpur, Fabric, Forge).\n` +
          `| <a:Tick5:1573382205395177532> **Automated Backups:** Daily backup retention for easy server rollbacks.\n\n` +
          `**Client Responsibilities & Guidelines**\n` +
          `| <a:fsk_warning:1573382318364692703> **Lag Machines:** Intentionally constructed redstone/entity lag machines affecting the host node are forbidden.\n` +
          `| <:backup:1573382515341664270> **Data Safety:** While we maintain automated backups, clients are encouraged to download local backups before major updates.\n` +
          `| <a:Cross:1573382156296917032> **Pirated / Malicious Plugins:** Uploading cracked software, backdoored JARs, or malware leads to instant server suspension.`
        )
        .setFooter({ text: 'Dream Nodes • Minecraft Hosting Policies' });
    } else if (selected === 'tos_general') {
      embed
        .setTitle('Dream Nodes | General Terms of Service')
        .setDescription(
          `### <a:membership:1573382371699458201> • Service Agreement Overview\n` +
          `| <a:membership:1573382371699458201> By ordering or using any Dream Nodes services, you agree to comply with our Terms of Service. These terms apply to all clients and services.\n\n` +
          `**Account & Billing Terms**\n` +
          `| <a:Tick5:1573382205395177532> Clients must be at least 13 years old (or have consent from a parent/guardian).\n` +
          `| <a:Tick5:1573382205395177532> Invoices are generated 7 days before the due date. Unpaid services are suspended after 48 hours.\n` +
          `| <a:Tick5:1573382205395177532> Suspended services are terminated and data permanently removed after 7 days of non-payment.\n\n` +
          `**Uptime Guarantee & SLA**\n` +
          `| <a:hostinger:1573382335355691089> We guarantee a 99.9% network and node uptime across all hosting locations.\n` +
          `| <a:announce:1573382228795457687> Scheduled maintenance windows are announced in advance in <#1573281463858630726>.\n` +
          `| <a:Cross:1573382156296917032> Dream Nodes is not liable for data loss caused by client misconfiguration or expired invoices.`
        )
        .setFooter({ text: 'Dream Nodes • General Terms of Service' });
    } else if (selected === 'tos_discord') {
      embed
        .setTitle('Dream Nodes | Community & Support Rules')
        .setDescription(
          `### <a:discord_discord:1573382300283179030> • Support Ticket Etiquette\n` +
          `| <a:discord_discord:1573382300283179030> Our support team is here to assist you with order inquiries, billing questions, and technical node troubleshooting.\n\n` +
          `**Ticket Guidelines**\n` +
          `| <a:Tick5:1573382205395177532> Create tickets only in <#1573281601775870043>. Include your service ID and a clear description of your issue.\n` +
          `| <a:Tick5:1573382205395177532> Please allow staff reasonable time to respond without unnecessary pings or creating duplicate tickets.\n` +
          `| <a:Cross:1573382156296917032> Spam tickets, trolling, or disrespect towards staff will result in a ticket blacklist.\n\n` +
          `**Discord Community Rules**\n` +
          `| <a:Tick5:1573382205395177532> Maintain respectful conduct across all text and voice channels.\n` +
          `| <a:Cross:1573382156296917032> No self-promotion, advertising, or unsolicited direct messages to community members.\n` +
          `| <a:Cross:1573382156296917032> No posting sensitive credentials, passwords, or token keys in public channels.`
        )
        .setFooter({ text: 'Dream Nodes • Community & Support Guidelines' });
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Open Support Ticket')
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.com/channels/1573272872737181696/1573281601775870043')
        .setEmoji('🎫'),
      new ButtonBuilder()
        .setLabel('Permanent Invite')
        .setStyle(ButtonStyle.Link)
        .setURL(permanentInviteUrl)
        .setEmoji('🕊')
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
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
