require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const { E, B } = require('./emojis');
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
const clientRoleId = '1573412778620747886'; // ⋆｡°✩ ƈʅιҽɳƚ ✩°｡⋆ (Paid Client)
const memberRoleId = '1573412782202818660'; // ⋆｡°✩ ɱҽɱႦҽɾ ✩°｡⋆ (General Community Member)
const honeypotChannelId = '1573337296042729502';
const honeypotMessageId = '1573402481214492685';
const honeypotLogsFile = path.join(__dirname, '..', 'data', 'honeypot_logs.json');

// Tickets System Module
const {
  handleTicketDepartmentSelect,
  handleTicketModalSubmit,
  handleTicketClaim,
  handleTicketClosePrompt,
  handleTicketCloseConfirm,
  handleTicketCloseCancel,
  handleTicketPingFounder,
  handleTicketAddUser,
  handleTicketRemoveUser
} = require('./tickets');

// Reviews System Module
const {
  postOrUpdateReviewHubPrompt,
  handleReviewSubmitBtn,
  handleReviewModalSubmit,
  handleReviewUsefulBtn,
  handleReviewSlashCommand,
  handleReviewRespondSlashCommand
} = require('./reviews');

// Components V2 Helpers
const {
  buildV2Container,
  buildV2Alert,
  buildPingV2,
  buildStatusV2,
  buildPlansV2,
  buildTestWelcomeV2,
  buildHoneypotLogsV2
} = require('./v2Containers');

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
        actionRow.components[0].label = `Traps Triggered: ${kicksCount}`;
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

// Pre-cache honeypot 3D image in memory for zero-latency DM delivery
const honeypotPath = path.join(__dirname, '..', 'assets', 'honeypot_3d.png');
let honeypotBuffer = null;
try {
  if (fs.existsSync(honeypotPath)) {
    honeypotBuffer = fs.readFileSync(honeypotPath);
    console.log('[HONEYPOT] Cached honeypot_3d.png in memory.');
  }
} catch (e) {
  console.error('[HONEYPOT IMAGE CACHE ERROR]', e);
}

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
    
    if (!dmRes.ok) {
      console.warn(`[HONEYPOT DM] Could not open DM channel with ${userId}: ${dmRes.status} ${dmRes.statusText}`);
      return false;
    }

    const dmChannel = await dmRes.json();
    if (!dmChannel.id) return false;

    const payload = {
      flags: 32768,
      ...(honeypotBuffer ? { attachments: [{ id: 0, filename: 'honeypot_3d.png' }] } : {}),
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
                    `### ${E.stopSign} **Dream Nodes Security Sentinel Alert**\n` +
                    `> ${E.alert} **Your account was kicked / softbanned.**\n` +
                    `> A message was sent from your account in our **# 𖹭ᐟ・ᴅᴏɴᴛ-ᴍꜱɢ-ʜᴇʀᴇ** honeypot channel.\n` +
                    `> This channel is an automated trap configured to catch compromised accounts, spambots, and token stealers.\n\n` +
                    `### ${E.security} **How to Secure Your Account:**\n` +
                    `> ${E.arrowBlue} **1. Change Your Discord Password** immediately (this immediately resets your bot token).\n` +
                    `> ${E.arrowBlue} **2. Enable Two-Factor Authentication (2FA)** for hardware or authenticator security.\n` +
                    `> ${E.arrowBlue} **3. Review Authorized Apps** (User Settings → Authorized Apps) and remove suspicious apps.\n\n` +
                    `### ${E.sparkles} **Rejoin Once Secure:**\n` +
                    `> Once you have secured your credentials, you are warmly welcome to rejoin our community!`
                }
              ],
              ...(honeypotBuffer ? {
                accessory: {
                  type: 11,
                  media: {
                    url: 'attachment://honeypot_3d.png'
                  }
                }
              } : {})
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
                  label: 'Rejoin Dream Nodes',
                  url: permanentInviteUrl,
                  emoji: B.discord
                },
                {
                  type: 2,
                  style: 5,
                  label: 'Account Safety Guide',
                  url: 'https://support.discord.com/hc/en-us/articles/24160905096599-Keeping-Your-Discord-Account-Safe',
                  emoji: B.security
                }
              ]
            },
            {
              type: 10,
              content: `-# ${E.verifiedBlue} Dream Nodes • Automated Sentinel Defense System`
            }
          ]
        }
      ]
    };

    let res;
    if (honeypotBuffer) {
      const formData = new FormData();
      formData.append('payload_json', JSON.stringify(payload));
      formData.append('files[0]', new File([honeypotBuffer], 'honeypot_3d.png', { type: 'image/png' }));

      res = await fetch(`https://discord.com/api/v10/channels/${dmChannel.id}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bot ${token}` },
        body: formData
      });
    } else {
      res = await fetch(`https://discord.com/api/v10/channels/${dmChannel.id}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bot ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    }

    const data = await res.json();
    if (data.id) return true;

    // Fallback if Components V2 fails
    console.warn('[HONEYPOT DM] Components V2 failed, dispatching standard fallback embed...');
    const fallbackRes = await fetch(`https://discord.com/api/v10/channels/${dmChannel.id}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        embeds: [{
          title: 'DREAM NODES ┃ SECURITY ALERT',
          color: 0x37373d,
          description:
            `**YOUR ACCOUNT WAS SOFTBANNED / KICKED**\n` +
            `> Your account sent a message in our honeypot channel.\n` +
            `> This channel is designed exclusively to trap automated spam bots.\n\n` +
            `**HOW TO RECOVER YOUR ACCOUNT:**\n` +
            `> 1. Change your Discord password immediately (resets token).\n` +
            `> 2. Enable Two-Factor Authentication (2FA).\n` +
            `> 3. Check authorized apps and revoke suspicious ones.\n\n` +
            `**JOIN US BACK ONCE SECURE:**\n` +
            `> Rejoin link: ${permanentInviteUrl}`,
          footer: { text: 'Dream Nodes • Automated Sentinel Defense' }
        }],
        components: [{
          type: 1,
          components: [{
            type: 2,
            style: 5,
            label: 'Rejoin Dream Nodes',
            url: permanentInviteUrl,
            emoji: B.discord
          }]
        }]
      })
    });
    const fallbackData = await fallbackRes.json();
    return !!fallbackData.id;
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
    .setDescription('Preview the animated welcome message in the welcome channel'),

  new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add a user to this support ticket channel')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user/member to add to this ticket channel')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a user from this support ticket channel')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user/member to remove from this ticket channel')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('pingfounder')
    .setDescription('Request assistance from server Founders for this ticket (Staff only)'),

  new SlashCommandBuilder()
    .setName('review')
    .setDescription('Submit a customer review for Dream Nodes hosting services'),

  new SlashCommandBuilder()
    .setName('respond')
    .setDescription('Post an official owner/staff response to a customer review')
    .addStringOption(option =>
      option
        .setName('review_id')
        .setDescription('The 8-character Review ID to respond to (e.g. 5e1d9d3f)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('response')
        .setDescription('Your response message to the client')
        .setRequired(true)
    )
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
                  `### ${E.sparkles} **Welcome to Dream Nodes!**\n` +
                  `> ${E.chat} Say hello in <#1574120435828662512>.\n` +
                  `> ${E.rulesBook} Read community rules in <#1573281463858630726>.\n` +
                  `> ${E.updates} Check server updates in <#1573337308529434756>.\n` +
                  `> ${E.minecraft} Explore hosting plans in <#1573281486822445128>.`
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
  await postOrUpdateReviewHubPrompt(client).catch(err => console.error('[REVIEW PROMPT INIT ERROR]', err));
});

// Automatic Welcome Message and Instant Member Auto-Role on Member Join
client.on('guildMemberAdd', async member => {
  // 1. Instantly auto-assign the Member role (Client role is strictly reserved for paid customers)
  try {
    if (!member.roles.cache.has(memberRoleId)) {
      await member.roles.add(memberRoleId, 'Auto-assigned Member role on member join');
      console.log(`[AUTOROLE] Instantly assigned Member role (1573412782202818660) to ${member.user.tag} (${member.id})`);
    }
  } catch (roleErr) {
    console.error(`[AUTOROLE ERROR] Failed to assign Member role to ${member.user.tag}:`, roleErr);
  }

  // 2. Dispatch the aesthetic welcome container
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
    let dmDelivered = false;

    try {
      // 1. Send the security recovery DM FIRST while member is guaranteed in the server
      if (!message.author.bot) {
        console.log(`[HONEYPOT] Triggered by ${userTag} (${userId}). Sending security recovery DM first...`);
        dmDelivered = await sendHoneypotAlertDM(userId).catch(err => {
          console.error('[HONEYPOT DM ERROR]', err);
          return false;
        });
        console.log(`[HONEYPOT] DM dispatch status for ${userTag}: ${dmDelivered ? 'DELIVERED' : 'FAILED/CLOSED_DMS'}`);

        // 2. Wait 1.5s grace period so Discord's Gateway delivers the DM and mobile push notification
        // while the mutual server relation is still 100% active in Discord's internal cache!
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // 3. Delete the honeypot trigger message
      await message.delete().catch(() => null);

      // 4. Check permissions and execute kick
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
      contentSnippet,
      dmStatus: dmDelivered ? 'SENT' : 'CLOSED_OR_BLOCKED'
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
      const logsPayload = buildHoneypotLogsV2(logs);
      await interaction.reply(logsPayload);
      return;
    } else if (interaction.customId.startsWith('ticket_claim_')) {
      await handleTicketClaim(interaction);
      return;
    } else if (interaction.customId.startsWith('ticket_ping_founder_')) {
      await handleTicketPingFounder(interaction);
      return;
    } else if (interaction.customId.startsWith('ticket_close_confirm_')) {
      await handleTicketCloseConfirm(interaction);
      return;
    } else if (interaction.customId.startsWith('ticket_close_cancel_')) {
      await handleTicketCloseCancel(interaction);
      return;
    } else if (interaction.customId.startsWith('ticket_close_')) {
      await handleTicketClosePrompt(interaction);
      return;
    } else if (interaction.customId === 'review_submit_btn') {
      await handleReviewSubmitBtn(interaction);
      return;
    } else if (interaction.customId.startsWith('review_useful_')) {
      await handleReviewUsefulBtn(interaction);
      return;
    }
    return;
  }

  // Handle Ticket Select Menu (Show intake question Modal)
  if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_create_menu') {
    try {
      await handleTicketDepartmentSelect(interaction);
    } catch (err) {
      console.error('[TICKET SELECT ERROR]', err);
    }
    return;
  }

  // Handle Modals
  if (interaction.isModalSubmit()) {
    if (interaction.customId.startsWith('modal_ticket_')) {
      try {
        await handleTicketModalSubmit(interaction);
      } catch (err) {
        console.error('[TICKET MODAL ERROR]', err);
      }
      return;
    } else if (interaction.customId === 'modal_review_submit') {
      try {
        await handleReviewModalSubmit(interaction);
      } catch (err) {
        console.error('[REVIEW MODAL ERROR]', err);
      }
      return;
    }
  }

  // Handle Terms of Service / Policy Dropdown Select Menu
  if (interaction.isStringSelectMenu() && interaction.customId === 'tos_select_menu') {
    try {
      const selected = interaction.values[0];
      let contentBody = '';
      let footerTag = '';

    if (selected === 'tos_refund') {
      contentBody =
        `# ${E.cash} Dream Nodes | Official Refund Policy\n\n` +
        `## ${E.hostinger} 24-Hour Money-Back Guarantee\n` +
        `> ${E.sparkles} We offer a **24-hour refund window** for first-time Minecraft and VPS hosting purchases if you encounter node-side technical problems or network outages that our support team is unable to resolve within a reasonable timeframe.\n\n` +
        `## ${E.tick5} Eligibility & Requirements\n` +
        `> ${E.arrowBlue} **Ticket Requirement:** All refund requests must be initiated via an official support ticket in <#1573281601775870043> within **24 hours** of the initial invoice payment.\n` +
        `> \n` +
        `> ${E.arrowBlue} **First-Time Orders:** The guarantee applies strictly to your initial service setup to prevent service cycling or abuse.\n` +
        `> \n` +
        `> ${E.arrowBlue} **Payout Options:** Eligible refunds can be sent back to the original payment method, or credited to your Dream Nodes account balance with an **extra +10% bonus credit**.\n\n` +
        `## ${E.cross} Non-Refundable Products & Exceptions\n` +
        `> ${E.redDot} **Domain Registrations & Transfers:** Due to upstream registry processing fees, domains cannot be cancelled or refunded once registered.\n` +
        `> \n` +
        `> ${E.redDot} **Dedicated Hardware:** Custom bare-metal servers, GPU instances, and custom enterprise deployments.\n` +
        `> \n` +
        `> ${E.redDot} **Crypto Payments:** Due to market volatility, payments made in cryptocurrency are non-refundable to wallets (eligible only as account store credit).\n` +
        `> \n` +
        `> ${E.redDot} **Abuse & TOS Terminations:** Any service suspended or terminated for violating our Acceptable Use Policy (DDoS, mining, spam, etc.) automatically forfeits all refund rights.\n\n` +
        `## ${E.alert} Disputes & Chargebacks\n` +
        `> ${E.siren} Filing an unauthorized PayPal dispute, credit card chargeback, or bank reversal without contacting support first will result in **immediate permanent server termination**, account blacklisting, and loss of all server files.`;
      footerTag = `-# ${E.verifiedBlue} Dream Nodes • Official Refund & Billing Agreement`;
    } else if (selected === 'tos_vps') {
      contentBody =
        `# ${E.vps} Dream Nodes | VPS & Cloud Policies\n\n` +
        `## ${E.cpu} Fair-Use & Resource Quotas\n` +
        `> ${E.hostinger} All Virtual Private Servers and RDPs run on enterprise Intel Xeon / AMD EPYC processors backed by Gen4 NVMe arrays. To ensure uninterrupted performance across all neighbor instances, shared-thread nodes follow fair-use resource allocation.\n\n` +
        `## ${E.tick5} Permitted Use Cases\n` +
        `> ${E.arrowBlue} **Game & Bot Hosting:** Running Discord bots, Minecraft networks, FiveM servers, CS2 servers, and backend APIs.\n` +
        `> \n` +
        `> ${E.arrowBlue} **Development & CI/CD:** Docker containers, software compilation, web hosting (Nginx/Apache), and personal databases.\n` +
        `> \n` +
        `> ${E.arrowBlue} **Personal VPNs:** Private WireGuard or OpenVPN tunnels for personal privacy.\n` +
        `> \n` +
        `> ${E.arrowBlue} **Full Root / Administrator:** Complete SSH / RDP control over your environment and operating system.\n\n` +
        `## ${E.cross} Prohibited Activities (Zero Tolerance)\n` +
        `> ${E.redDot} **Cryptocurrency Mining:** Any CPU/GPU mining (Monero, Bitcoin, Ravencoin, etc.) results in immediate termination with no refund.\n` +
        `> \n` +
        `> ${E.redDot} **Network Attacks & Stressers:** Initiating or participating in DDoS/DoS attacks, botnet controllers, or IP flooders.\n` +
        `> \n` +
        `> ${E.redDot} **Port Scanning & Exploitation:** Probing IP ranges, vulnerability scanning, or brute-forcing SSH/RDP/FTP credentials.\n` +
        `> \n` +
        `> ${E.redDot} **Tor & Open Relays:** Operating public Tor exit nodes, open proxies, or malicious redirection services.\n` +
        `> \n` +
        `> ${E.redDot} **Mass Mailers (Spam):** Outbound SMTP port 25 is blocked by default across all VPS nodes to prevent email spam.\n\n` +
        `## ${E.siren} Automated Node Defense\n` +
        `> ${E.shield} Automated network filters monitor for abnormal outgoing traffic spikes. Instances engaging in attacks are frozen instantly by our automated sentinels.`;
      footerTag = `-# ${E.verifiedBlue} Dream Nodes • Cloud VPS & Compute Standards`;
    } else if (selected === 'tos_mc') {
      contentBody =
        `# ${E.minecraft} Dream Nodes | Minecraft Hosting Policies\n\n` +
        `## ${E.hostinger} Game Server Architecture\n` +
        `> ${E.lightning} Dream Nodes Minecraft instances are built on high single-core frequency processors and enterprise NVMe storage to guarantee 20 TPS, zero hitching, and rapid chunk loading.\n\n` +
        `## ${E.tick5} Included Features & Benefits\n` +
        `> ${E.arrowBlue} **Unmetered NVMe SSD Storage:** Fair-use storage for world saves, modpacks, plugins, and server logs.\n` +
        `> \n` +
        `> ${E.arrowBlue} **Automated DDoS Shielding:** Enterprise Layer 4 and Layer 7 filtration engineered specifically for Minecraft packet protocols (preventing ping attacks and null-ping boots).\n` +
        `> \n` +
        `> ${E.arrowBlue} **SFTP & Custom JARs:** Full access to upload any custom software including Paper, Purpur, Fabric, Forge, NeoForge, Velocity, and BungeeCord.\n` +
        `> \n` +
        `> ${E.arrowBlue} **Automated Backups:** Daily snapshots stored off-node for easy world recovery.\n\n` +
        `## ${E.alert} Server Guidelines & Prohibitions\n` +
        `> ${E.redDot} **Intentional Node Lag Machines:** Building deliberate redstone or entity loop lag contraptions intended to degrade node stability is forbidden.\n` +
        `> \n` +
        `> ${E.redDot} **Cracked / Backdoored Plugins:** Uploading malware-infected plugins or leaking server credentials puts your service at risk and leads to suspension.\n` +
        `> \n` +
        `> ${E.redDot} **Backup Responsibility:** While we maintain automated server snapshots, clients are encouraged to download local copies prior to major modpack migrations.`;
      footerTag = `-# ${E.verifiedBlue} Dream Nodes • Game Server Policies`;
    } else if (selected === 'tos_general') {
      contentBody =
        `# ${E.membership} Dream Nodes | General Terms of Service\n\n` +
        `## ${E.hostinger} Official Service Agreement\n` +
        `> ${E.membership} By purchasing, leasing, or using any service provided by Dream Nodes, you contractually agree to comply with all terms laid out in this agreement.\n\n` +
        `## ${E.tick5} Account Ownership & Billing Cycles\n` +
        `> ${E.arrowBlue} **Age Requirement:** Clients must be at least 13 years old or have explicit authorization from a parent or legal guardian.\n` +
        `> \n` +
        `> ${E.arrowBlue} **Invoicing:** Renewal invoices are issued 7 days before the service due date. Reminders are dispatched via email and Discord.\n` +
        `> \n` +
        `> ${E.arrowBlue} **Grace Period & Suspension:** Unpaid invoices result in service suspension after **48 hours** past due.\n` +
        `> \n` +
        `> ${E.arrowBlue} **Data Termination:** Suspended services that remain unpaid for **7 consecutive days** are permanently deleted and cannot be recovered.\n\n` +
        `## ${E.lightning} Uptime SLA & Service Continuity\n` +
        `> ${E.arrowBlue} **99.9% Network Guarantee:** We strive for continuous operational uptime. In the event of unforeseen node hardware failure exceeding SLA terms, service credits may be granted upon request.\n` +
        `> \n` +
        `> ${E.arrowBlue} **Scheduled Maintenance:** Routine hardware upgrades and kernel updates are announced in advance in <#1573281463858630726>.`;
      footerTag = `-# ${E.verifiedBlue} Dream Nodes • Master Terms of Service`;
    } else if (selected === 'tos_discord') {
      contentBody =
        `# ${E.discord} Dream Nodes | Community & Support Rules\n\n` +
        `## ${E.chat} Support Ticket Conduct\n` +
        `> ${E.hostinger} Our staff and technical support team work around the clock to provide swift assistance for sales, billing, and technical queries.\n\n` +
        `## ${E.tick5} How to Open a Ticket\n` +
        `> ${E.arrowBlue} **Official Channel:** Open tickets solely through <#1573281601775870043>. Never DM staff members for official technical support.\n` +
        `> \n` +
        `> ${E.arrowBlue} **Include Details:** State your service ID, node location, and a detailed description of the error to speed up resolution.\n` +
        `> \n` +
        `> ${E.arrowBlue} **No Staff Pings:** Pinging staff members inside or outside tickets will not accelerate your ticket and may result in a warning.\n` +
        `> \n` +
        `> ${E.arrowBlue} **Duplicate Tickets:** Opening multiple tickets for the same inquiry is prohibited and leads to a ticket blacklist.\n\n` +
        `## ${E.cross} Server Community Standards\n` +
        `> ${E.redDot} **No Toxicity or Harassment:** Respect every member in public channels and voice lounges.\n` +
        `> \n` +
        `> ${E.redDot} **No Unsolicited Advertising:** Direct messaging members to sell hosting, services, or bot invites is strictly prohibited.\n` +
        `> \n` +
        `> ${E.redDot} **No Credential Sharing:** Never share server passwords, SSH keys, or panel tokens in public chat channels.`;
      footerTag = `-# ${E.verifiedBlue} Dream Nodes • Community & Ticket Guidelines`;
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
                  emoji: B.ticket
                },
                {
                  type: 2,
                  style: 5,
                  label: 'Permanent Invite',
                  url: permanentInviteUrl,
                  emoji: B.discord
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
    } catch (err) {
      console.error('[TOS SELECT ERROR]', err);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: `${E.alert} An error occurred while retrieving this policy. Please try again or create a ticket in <#1573281601775870043>.`,
          ephemeral: true
        }).catch(() => null);
      }
    }
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    const wsPing = client.ws.ping;
    const uptimeHours = (process.uptime() / 3600).toFixed(1);
    await interaction.reply(buildPingV2(wsPing, uptimeHours));
  }

  else if (commandName === 'status') {
    const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
    const uptimeHours = (process.uptime() / 3600).toFixed(1);
    const wsPing = client.ws.ping;
    await interaction.reply(buildStatusV2({ wsPing, uptimeHours, memUsage }));
  }

  else if (commandName === 'plans') {
    await interaction.reply(buildPlansV2());
  }

  else if (commandName === 'testwelcome') {
    const targetChannel = interaction.guild.channels.cache.get(welcomeChannelId) || interaction.channel;
    await sendWelcomeV2(targetChannel.id, interaction.member);
    await interaction.reply(buildTestWelcomeV2(targetChannel.id));
  }

  else if (commandName === 'add') {
    await handleTicketAddUser(interaction);
  }

  else if (commandName === 'remove') {
    await handleTicketRemoveUser(interaction);
  }

  else if (commandName === 'pingfounder') {
    await handleTicketPingFounder(interaction);
  }

  else if (commandName === 'review') {
    await handleReviewSlashCommand(interaction);
  }

  else if (commandName === 'respond') {
    await handleReviewRespondSlashCommand(interaction);
  }
});

// Global Process Error Sentinel
process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED REJECTION]', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err);
});
client.on('error', (err) => {
  console.error('[CLIENT ERROR]', err);
});

client.login(token);
