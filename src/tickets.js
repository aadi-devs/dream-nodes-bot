const fs = require('fs');
const path = require('path');
const { 
  OverwriteType, 
  PermissionFlagsBits, 
  EmbedBuilder, 
  AttachmentBuilder 
} = require('discord.js');
const { generateHtmlTranscript, formatDuration } = require('./transcript');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const ticketsFile = path.join(dataDir, 'tickets.json');

function getTicketData() {
  try {
    if (fs.existsSync(ticketsFile)) {
      return JSON.parse(fs.readFileSync(ticketsFile, 'utf8'));
    }
  } catch (e) {
    console.error('[TICKETS DATA READ ERROR]', e);
  }
  return { counter: 1, activeTickets: {} };
}

function saveTicketData(data) {
  try {
    fs.writeFileSync(ticketsFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('[TICKETS DATA WRITE ERROR]', e);
  }
}

const TICKET_LOGS_CHANNEL_ID = '1573780018834710548'; // ⊘・ᴛɪᴄᴋᴇᴛ-ʟᴏɢꜱ

const CATEGORIES = {
  ticket_buy: {
    key: 'buy',
    name: 'Buy / Purchase Hosting',
    categoryId: '1573281628438921246', // ✦----- BUY TICKETS -----✦
    emoji: '<a:cash:1573382269735805008>',
    emojiObj: { id: '1573382269735805008', name: 'cash', animated: true },
    desc: 'Order Minecraft nodes, VPS, RDP, Web or Bot hosting',
    staffPingRoleId: '1573412759532732567', // ⋆｡°✩ ʂυρρσɾƚ ✩°｡⋆
    modalTitle: '🛒 Order Hosting Services',
    modalInputs: [
      {
        customId: 'buy_plan',
        label: 'Desired Service / Plan',
        placeholder: 'e.g. Budget MC 4GB, Intel VPS 8GB, Bot Hosting 2GB, Web L',
        style: 1, // Short
        required: true,
        max_length: 100
      },
      {
        customId: 'buy_location',
        label: 'Server Location',
        placeholder: 'e.g. India (Noida) or Singapore',
        style: 1, // Short
        required: true,
        max_length: 100
      },
      {
        customId: 'buy_payment',
        label: 'Preferred Payment Method',
        placeholder: 'e.g. UPI / PhonePe / GPay, Crypto, Debit/Credit Card',
        style: 1, // Short
        required: true,
        max_length: 100
      },
      {
        customId: 'buy_notes',
        label: 'Additional Requirements / Custom Specs',
        placeholder: 'e.g. OS choice (Ubuntu/Debian), custom subdomain, billing cycle',
        style: 2, // Paragraph
        required: false,
        max_length: 1000
      }
    ]
  },
  ticket_queries: {
    key: 'queries',
    name: 'General Queries & Inquiries',
    categoryId: '1573773163605659768', // ✦----- QUERY TICKETS -----✦
    emoji: '<a:chat:1573382277164040214>',
    emojiObj: { id: '1573382277164040214', name: 'chat', animated: true },
    desc: 'Ask about server specs, custom builds, locations or billing',
    staffPingRoleId: '1573412759532732567', // ⋆｡°✩ ʂυρρσɾƚ ✩°｡⋆
    modalTitle: '❓ General Inquiry & Pre-Sales',
    modalInputs: [
      {
        customId: 'query_topic',
        label: 'Inquiry Topic / Subject',
        placeholder: 'e.g. Server specs, Custom configuration, Billing question',
        style: 1, // Short
        required: true,
        max_length: 100
      },
      {
        customId: 'query_details',
        label: 'How can our staff team assist you?',
        placeholder: 'Please describe your inquiry or questions in detail...',
        style: 2, // Paragraph
        required: true,
        max_length: 1000
      },
      {
        customId: 'query_client',
        label: 'Are you an existing client?',
        placeholder: 'Yes (mention service IP / ID if applicable) or No',
        style: 1, // Short
        required: false,
        max_length: 100
      }
    ]
  },
  ticket_staff_report: {
    key: 'report',
    name: 'Staff Misconduct Report',
    categoryId: '1573773165539233852', // ✦----- STAFF REPORTS -----✦
    emoji: '<a:siren:1573382431065509981>',
    emojiObj: { id: '1573382431065509981', name: 'siren', animated: true },
    desc: 'Confidential report sent directly to executive management',
    highStaffOnly: true,
    staffPingRoleId: '1573412749986365500', // ⋆｡°✩ αԃɱιɳ ✩°｡⋆
    modalTitle: '🚨 Confidential Staff Report',
    modalInputs: [
      {
        customId: 'report_staff',
        label: 'Staff Member Name / Discord ID',
        placeholder: 'e.g. @staffmember or 18-digit Discord ID',
        style: 1, // Short
        required: true,
        max_length: 100
      },
      {
        customId: 'report_reason',
        label: 'Incident Details & Rules Violated',
        placeholder: 'Explain what happened, date/time, and misconduct observed...',
        style: 2, // Paragraph
        required: true,
        max_length: 1000
      },
      {
        customId: 'report_evidence',
        label: 'Proof / Evidence Links',
        placeholder: 'Links to screenshots, recordings, or message links',
        style: 2, // Paragraph
        required: true,
        max_length: 1000
      }
    ]
  },
  ticket_problems: {
    key: 'problems',
    name: 'Technical Problems & Issues',
    categoryId: '1573773168177582142', // ✦----- PROBLEM TICKETS -----✦
    emoji: '<a:settings:1573382421611806763>',
    emojiObj: { id: '1573382421611806763', name: 'settings', animated: true },
    desc: 'Report server offline, node downtime, bugs or control panel help',
    staffPingRoleId: '1573412759532732567', // ⋆｡°✩ ʂυρρσɾƚ ✩°｡⋆
    modalTitle: '🛠️ Technical Problems & Support',
    modalInputs: [
      {
        customId: 'problem_service',
        label: 'Affected Service IP or Server / Node ID',
        placeholder: 'e.g. 194.xxx.xxx.xxx or Pterodactyl Server ID / Name',
        style: 1, // Short
        required: true,
        max_length: 100
      },
      {
        customId: 'problem_desc',
        label: 'Describe the issue you are experiencing',
        placeholder: 'e.g. Server won\'t start, high latency, panel connection timeout',
        style: 2, // Paragraph
        required: true,
        max_length: 1000
      },
      {
        customId: 'problem_logs',
        label: 'Error logs / Steps tried',
        placeholder: 'Paste console error, crash stacktrace, or troubleshooting tried',
        style: 2, // Paragraph
        required: false,
        max_length: 1000
      }
    ]
  }
};

const STAFF_ROLES = [
  '1573412727383392427', // Founder
  '1573412731644805140', // CEO
  '1573412734698004550', // COO
  '1573412738074550514', // Manager
  '1573412741031530506', // Developer
  '1573412746689515770', // Sysadmin
  '1573412749986365500', // Admin
  '1573412753073381477', // Head Mod
  '1573412756286214306', // Mod
  '1573412759532732567', // Support
  '1573412762586189844'  // Trial Staff
];

const HIGH_STAFF_ROLES = [
  '1573412727383392427', // Founder
  '1573412731644805140', // CEO
  '1573412734698004550', // COO
  '1573412738074550514', // Manager
  '1573412749986365500'  // Admin
];

function isStaff(member, highOnly = false) {
  if (!member) return false;
  if (member.permissions?.has('Administrator')) return true;
  const rolesToCheck = highOnly ? HIGH_STAFF_ROLES : STAFF_ROLES;
  return rolesToCheck.some(roleId => member.roles?.cache?.has(roleId));
}

/**
 * Log Ticket Events to the dedicated logs channel (# ⊘・ᴛɪᴄᴋᴇᴛ-ʟᴏɢꜱ)
 */
async function logTicketEvent(client, eventType, data, attachment = null) {
  try {
    const logsChannel = client.channels.cache.get(TICKET_LOGS_CHANNEL_ID) ||
      await client.channels.fetch(TICKET_LOGS_CHANNEL_ID).catch(() => null);
    if (!logsChannel) {
      console.warn('[TICKET LOGS] Logs channel not found:', TICKET_LOGS_CHANNEL_ID);
      return;
    }

    if (eventType === 'OPEN') {
      const intakeSummary = (data.intakeAnswers || [])
        .map(a => `> **${a.label}:** \`${a.value}\``)
        .join('\n');

      const embed = new EmbedBuilder()
        .setTitle(`🟢 Ticket Opened: #${data.ticketNum}`)
        .setColor([67, 181, 129]) // Discord Green
        .setDescription(
          `📂 **Category:** \`${data.categoryName}\`\n` +
          `👤 **Opened By:** <@${data.userId}> (\`${data.userTag}\` ┃ \`${data.userId}\`)\n` +
          `📍 **Channel:** <#${data.channelId}>\n` +
          `⏰ **Opened At:** <t:${Math.floor(Date.now() / 1000)}:F> (<t:${Math.floor(Date.now() / 1000)}:R>)\n\n` +
          `### 📋 Submitted Intake Details:\n` +
          (intakeSummary || '> *None provided*')
        )
        .setFooter({ text: `Dream Nodes Tickets • Ticket #${data.ticketNum}` })
        .setTimestamp();

      await logsChannel.send({ embeds: [embed] });
    } else if (eventType === 'CLAIM') {
      const embed = new EmbedBuilder()
        .setTitle(`✋ Ticket Claimed: #${data.ticketNum}`)
        .setColor([250, 166, 26]) // Discord Amber
        .setDescription(
          `📂 **Category:** \`${data.categoryName}\`\n` +
          `🛡️ **Claimed By:** <@${data.claimedBy}> (\`${data.claimedTag}\`)\n` +
          `👤 **Ticket Creator:** <@${data.userId}> (\`${data.userTag}\`)\n` +
          `📍 **Channel:** <#${data.channelId}>\n` +
          `⏰ **Claimed At:** <t:${Math.floor(Date.now() / 1000)}:R>`
        )
        .setFooter({ text: `Dream Nodes Tickets • Ticket #${data.ticketNum}` })
        .setTimestamp();

      await logsChannel.send({ embeds: [embed] });
    } else if (eventType === 'CLOSE') {
      const embed = new EmbedBuilder()
        .setTitle(`🔒 Ticket Closed: #${data.ticketNum}`)
        .setColor([240, 71, 71]) // Discord Red
        .setDescription(
          `📂 **Category:** \`${data.categoryName}\`\n` +
          `👤 **Opened By:** <@${data.userId}> (\`${data.userTag}\`)\n` +
          `🛡️ **Claimed By:** ${data.claimedBy ? `<@${data.claimedBy}> (\`${data.claimedTag}\`)` : '`Unclaimed`'}\n` +
          `🔒 **Closed By:** <@${data.closedBy}> (\`${data.closedTag}\`)\n` +
          `⏱️ **Total Duration:** \`${data.duration}\`\n` +
          `💬 **Total Messages:** \`${data.messageCount}\`\n\n` +
          `📄 **Transcript:** The full conversation history has been archived and uploaded below as an HTML transcript.`
        )
        .setFooter({ text: `Dream Nodes Tickets • Ticket #${data.ticketNum}` })
        .setTimestamp();

      const options = { embeds: [embed] };
      if (attachment) {
        options.files = [attachment];
      }
      await logsChannel.send(options);
    }
  } catch (err) {
    console.error('[TICKET LOG EVENT ERROR]', err);
  }
}

// Build the Main Ticket Panel Components V2 Payload
function buildTicketPanelPayload() {
  const panelHeader =
`# 🎫 𝐃𝐑𝐄𝐀𝐌 𝐍𝐎𝐃𝐄𝐒 ┃ Support & Ticket Desk
## <a:sparkles_sparkles:1573382447603785928> 24/7 Client Helpdesk • Instant Orders • Technical Support • Inquiries

> <a:Rotating_Star:1573382194020491317> **Welcome to the official Dream Nodes Support Center!**
> Looking to purchase a hosting package, ask a pre-sales question, report a technical problem, or speak confidentially with management?
> 
> Choose the relevant department from the **interactive menu below** to create your dedicated private ticket channel.

### <a:RedCrown:1573382179298353186> Support Departments:
> 🛒 **Buy / Purchase Hosting:** Order Minecraft, Intel / AMD VPS, RDP, Web Hosting, or Bot Nodes.
> ❓ **General Queries:** Ask questions regarding server specs, custom quotes, locations, or billing.
> 🚨 **Staff Report:** Confidentially report staff misconduct directly to executive leadership.
> 🛠️ **Problems & Issues:** Report downtime, control panel errors, server crashes, or network bugs.

### <a:info:1573382351214354483> Support Guidelines:
> ✦ **One Ticket Per Topic:** Please avoid creating multiple tickets for the same inquiry.
> ✦ **Fill Required Questions:** State your plan, node location, or issue details in the popup form.
> ✦ **Patient Response:** Our staff team is alerted automatically. Unnecessary pings are not required.`;

  return {
    flags: 32768, // IS_COMPONENTS_V2
    components: [
      {
        type: 17, // Borderless Container
        components: [
          {
            type: 10,
            content: panelHeader
          },
          {
            type: 14,
            divider: true,
            spacing: 1
          },
          {
            type: 1, // Action Row for Select Menu
            components: [
              {
                type: 3, // String Select Menu
                custom_id: 'ticket_create_menu',
                placeholder: '📩 Select a department to open a ticket...',
                options: Object.entries(CATEGORIES).map(([val, cat]) => ({
                  label: cat.name,
                  value: val,
                  description: cat.desc,
                  emoji: cat.emojiObj
                }))
              }
            ]
          },
          {
            type: 14,
            divider: true,
            spacing: 1
          },
          {
            type: 1, // Action Row for Direct Links
            components: [
              {
                type: 2,
                style: 5,
                label: 'Official Website',
                url: 'https://dreamnodes.com',
                emoji: { name: '🌐' }
              },
              {
                type: 2,
                style: 5,
                label: 'How To Buy',
                url: 'https://discord.com/channels/1573272872737181696/1573281597464121425',
                emoji: { name: '📖' }
              },
              {
                type: 2,
                style: 5,
                label: 'Terms & Policies',
                url: 'https://discord.com/channels/1573272872737181696/1573337303538208778',
                emoji: { name: '📜' }
              }
            ]
          },
          {
            type: 10,
            content: '-# 💙 Dream Nodes • High-Performance Cloud Hosting & 24/7 Client Care Desk'
          }
        ]
      }
    ]
  };
}

/**
 * Handle Department Selection from the Dropdown Select Menu
 * Shows a tailored Modal with questions the staff member needs to know!
 */
async function handleTicketDepartmentSelect(interaction) {
  const selectedValue = interaction.values?.[0];
  const catConfig = CATEGORIES[selectedValue];
  if (!catConfig) {
    return interaction.reply({
      content: '⚠️ Unknown department selected. Please try again.',
      ephemeral: true
    });
  }

  // Check if user already has an active ticket in this category
  const data = getTicketData();
  const existingTicket = Object.values(data.activeTickets).find(
    t => t.userId === interaction.user.id && t.categoryKey === catConfig.key
  );

  if (existingTicket) {
    const channelExists = interaction.guild.channels.cache.get(existingTicket.channelId);
    if (channelExists) {
      return interaction.reply({
        content: `⚠️ You already have an open ticket in this department: <#${existingTicket.channelId}>. Please use that channel or close it before creating a new one.`,
        ephemeral: true
      });
    }
  }

  // Construct Discord Modal with department-specific intake questions
  const modalPayload = {
    title: catConfig.modalTitle,
    custom_id: `modal_${selectedValue}`,
    components: catConfig.modalInputs.map(input => ({
      type: 1, // Action Row
      components: [
        {
          type: 4, // TextInput
          custom_id: input.customId,
          label: input.label,
          style: input.style,
          placeholder: input.placeholder,
          required: input.required,
          max_length: input.max_length
        }
      ]
    }))
  };

  // Must call showModal directly to open Discord native popup
  await interaction.showModal(modalPayload);
}

/**
 * Handle Modal Submission when user fills out the intake questions
 */
async function handleTicketModalSubmit(interaction) {
  // Immediately defer reply so Discord Gateway never times out
  await interaction.deferReply({ ephemeral: true });

  const catKey = interaction.customId.replace('modal_', '');
  const catConfig = CATEGORIES[catKey];
  if (!catConfig) {
    return interaction.editReply({
      content: '⚠️ Unknown department form submitted. Please try again.'
    });
  }

  const data = getTicketData();

  // Prevent duplicate tickets in same category
  const existingTicket = Object.values(data.activeTickets).find(
    t => t.userId === interaction.user.id && t.categoryKey === catConfig.key
  );
  if (existingTicket) {
    const channelExists = interaction.guild.channels.cache.get(existingTicket.channelId);
    if (channelExists) {
      return interaction.editReply({
        content: `⚠️ You already have an open ticket in this department: <#${existingTicket.channelId}>. Please use that channel or close it before creating a new one.`
      });
    }
  }

  try {
    const ticketNum = String(data.counter).padStart(4, '0');
    data.counter++;

    // Collect answers submitted by the user
    const intakeAnswers = catConfig.modalInputs.map(input => {
      let val = '';
      try {
        val = interaction.fields.getTextInputValue(input.customId) || '';
      } catch (e) {
        val = '';
      }
      return {
        label: input.label,
        value: val.trim() || 'Not specified'
      };
    });

    // Format requested by user: [Ticket Number]-Categoryname-claimed byname
    const channelName = `〔${ticketNum}〕-${catConfig.key}-unclaimed`;

    // Roles to grant channel view
    const rolesToGrant = catConfig.highStaffOnly ? HIGH_STAFF_ROLES : STAFF_ROLES;

    const overwrites = [
      {
        id: interaction.guild.id, // @everyone
        deny: [PermissionFlagsBits.ViewChannel],
        type: OverwriteType.Role
      },
      {
        id: interaction.client.user.id, // Bot
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.ManageChannels,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.EmbedLinks,
          PermissionFlagsBits.AttachFiles,
          PermissionFlagsBits.ReadMessageHistory
        ],
        type: OverwriteType.Member
      },
      {
        id: interaction.user.id, // Ticket Creator
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.EmbedLinks,
          PermissionFlagsBits.AttachFiles,
          PermissionFlagsBits.ReadMessageHistory
        ],
        type: OverwriteType.Member
      },
      ...rolesToGrant.map(rId => ({
        id: rId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.EmbedLinks,
          PermissionFlagsBits.AttachFiles,
          PermissionFlagsBits.ReadMessageHistory
        ],
        type: OverwriteType.Role
      }))
    ];

    const ticketChannel = await interaction.guild.channels.create({
      name: channelName,
      type: 0, // GuildText
      parent: catConfig.categoryId,
      permissionOverwrites: overwrites,
      topic: `Dream Nodes Ticket #${ticketNum} • Category: ${catConfig.name} • Created by ${interaction.user.tag} (${interaction.user.id})`
    });

    data.activeTickets[ticketChannel.id] = {
      ticketNum,
      categoryKey: catConfig.key,
      categoryName: catConfig.name,
      channelId: ticketChannel.id,
      userId: interaction.user.id,
      userTag: interaction.user.tag,
      claimedBy: null,
      claimedTag: null,
      createdAt: Math.floor(Date.now() / 1000),
      intakeAnswers
    };
    saveTicketData(data);

    // 1. Ping the staff role in the new ticket channel so staff are alerted immediately!
    const staffPingRole = catConfig.staffPingRoleId;
    await ticketChannel.send({
      content: `🔔 <@&${staffPingRole}> • New **${catConfig.name}** ticket opened by <@${interaction.user.id}>!`
    });

    // 2. Format the user's intake questions & answers cleanly
    const intakeFormatted = intakeAnswers.map(ans => `> 🔹 **${ans.label}:** \`${ans.value}\``).join('\n');

    // 3. Build the aesthetic welcoming Components V2 message inside the new ticket channel
    const welcomeHeader =
`# 🎫 Dʀᴇᴀᴍ Nᴏᴅᴇs ┃ Ticket #${ticketNum}
### <a:sparkles_sparkles:1573382447603785928> Welcome <@${interaction.user.id}>! Support Desk Initialized

> <a:Rotating_Star:1573382194020491317> **Thank you for contacting Dream Nodes Support!**
> Our staff team has been alerted and will assist you shortly.
> 
> ⏳ **Please wait patiently:** Our staff will claim this ticket soon. Avoid spamming pings so we can assist everyone swiftly. Feel free to send screenshots, error codes, or further details below.`;

    const ticketMessagePayload = {
      flags: 32768, // IS_COMPONENTS_V2
      components: [
        {
          type: 17, // Borderless Container
          components: [
            {
              type: 10,
              content: welcomeHeader
            },
            {
              type: 14,
              divider: true,
              spacing: 1
            },
            {
              type: 10,
              content:
                `### 📋 Intake Information Provided:\n` +
                intakeFormatted
            },
            {
              type: 14,
              divider: true,
              spacing: 1
            },
            {
              type: 10,
              content:
                `> 📂 **Category:** \`${catConfig.name}\` ┃ 👤 **Opened By:** <@${interaction.user.id}>\n` +
                `> 🛡️ **Status:** \`🟡 Unclaimed\` *(Staff will claim shortly)*`
            },
            {
              type: 14,
              divider: true,
              spacing: 1
            },
            {
              type: 1, // Action Row with Buttons
              components: [
                {
                  type: 2,
                  style: 3, // Success / Green
                  label: 'Claim Ticket',
                  custom_id: `ticket_claim_${ticketChannel.id}`,
                  emoji: { name: '✋' }
                },
                {
                  type: 2,
                  style: 4, // Danger / Red
                  label: 'Close Ticket',
                  custom_id: `ticket_close_${ticketChannel.id}`,
                  emoji: { name: '🔒' }
                }
              ]
            },
            {
              type: 10,
              content: '-# 💙 Dream Nodes • 24/7 Dedicated Client Support Helpdesk'
            }
          ]
        }
      ]
    };

    const botAuthToken = process.env.DISCORD_TOKEN || interaction.client.token;
    await fetch(`https://discord.com/api/v10/channels/${ticketChannel.id}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${botAuthToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ticketMessagePayload)
    });

    // 4. Log ticket creation in dedicated ticket logs channel (# ⊘・ᴛɪᴄᴋᴇᴛ-ʟᴏɢꜱ)
    await logTicketEvent(interaction.client, 'OPEN', {
      ticketNum,
      categoryName: catConfig.name,
      categoryKey: catConfig.key,
      channelId: ticketChannel.id,
      userId: interaction.user.id,
      userTag: interaction.user.tag,
      intakeAnswers
    });

    // 5. Notify user with direct channel link
    await interaction.editReply({
      content: `✅ Your **${catConfig.name}** ticket has been created! Click here to jump to your ticket: <#${ticketChannel.id}>`
    });

  } catch (err) {
    console.error('[TICKET MODAL SUBMIT ERROR]', err);
    await interaction.editReply({
      content: '⚠️ Failed to create support ticket. Please contact an administrator.'
    });
  }
}

// Handle Staff Claiming a Ticket
async function handleTicketClaim(interaction) {
  const ticketChannel = interaction.channel;
  const data = getTicketData();
  const ticket = data.activeTickets[ticketChannel.id];

  if (!ticket) {
    return interaction.reply({
      content: '⚠️ This channel is not recognized as an active ticket.',
      ephemeral: true
    });
  }

  // Permission check
  const isHighStaff = isStaff(interaction.member, true);
  const isGeneralStaff = isStaff(interaction.member, false);

  if (ticket.categoryKey === 'report' && !isHighStaff) {
    return interaction.reply({
      content: '❌ Staff Reports can only be claimed by Executive Staff (Admin / Manager / CEO / Founder).',
      ephemeral: true
    });
  }

  if (!isGeneralStaff) {
    return interaction.reply({
      content: '❌ Only verified Dream Nodes staff members can claim support tickets.',
      ephemeral: true
    });
  }

  if (ticket.claimedBy) {
    return interaction.reply({
      content: `⚠️ This ticket has already been claimed by <@${ticket.claimedBy}>.`,
      ephemeral: true
    });
  }

  const staffSlug = interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10) || 'staff';
  const newChannelName = `〔${ticket.ticketNum}〕-${ticket.categoryKey}-${staffSlug}`;

  ticket.claimedBy = interaction.user.id;
  ticket.claimedTag = interaction.user.tag;
  saveTicketData(data);

  try {
    await ticketChannel.setName(newChannelName, `Ticket claimed by ${interaction.user.tag}`);

    // Post claim announcement in ticket channel
    await ticketChannel.send({
      content: `✋ **<@${interaction.user.id}> has claimed this ticket!** They are now reviewing your inquiry and will assist you immediately.`
    });

    // Log claim event in ticket logs channel
    await logTicketEvent(interaction.client, 'CLAIM', {
      ticketNum: ticket.ticketNum,
      categoryName: ticket.categoryName,
      channelId: ticketChannel.id,
      userId: ticket.userId,
      userTag: ticket.userTag,
      claimedBy: interaction.user.id,
      claimedTag: interaction.user.tag
    });

    await interaction.reply({
      content: `✅ You have successfully claimed ticket **#${ticket.ticketNum}**! Channel updated to \`${newChannelName}\`.`,
      ephemeral: true
    });
  } catch (err) {
    console.error('[TICKET CLAIM ERROR]', err);
    await interaction.reply({
      content: '⚠️ Failed to rename channel, but claim has been recorded.',
      ephemeral: true
    });
  }
}

// Handle Ticket Close Button Click (Show Confirmation)
async function handleTicketClosePrompt(interaction) {
  const data = getTicketData();
  const ticket = data.activeTickets[interaction.channelId];

  if (!ticket) {
    return interaction.reply({
      content: '⚠️ This channel is not recognized as an active ticket.',
      ephemeral: true
    });
  }

  // Ask for confirmation before deleting
  const confirmPayload = {
    content: '⚠️ **Are you sure you want to close and archive this ticket channel?**\nA full transcript will be saved to the ticket logs channel.',
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 4, // Danger / Red
            label: 'Confirm Close',
            custom_id: `ticket_close_confirm_${interaction.channelId}`,
            emoji: { name: '🔒' }
          },
          {
            type: 2,
            style: 2, // Secondary / Grey
            label: 'Cancel',
            custom_id: `ticket_close_cancel_${interaction.channelId}`,
            emoji: { name: '❌' }
          }
        ]
      }
    ],
    ephemeral: true
  };

  await interaction.reply(confirmPayload);
}

// Handle Ticket Close Confirmation & Generate HTML Transcript
async function handleTicketCloseConfirm(interaction) {
  const ticketChannel = interaction.channel;
  const data = getTicketData();
  const ticket = data.activeTickets[ticketChannel.id] || {
    ticketNum: '0000',
    categoryKey: 'support',
    categoryName: 'Support Ticket',
    userId: interaction.user.id,
    userTag: interaction.user.tag,
    createdAt: Math.floor(Date.now() / 1000)
  };

  await interaction.reply({
    content: `🔒 **Ticket closed by <@${interaction.user.id}>.** Saving transcript and deleting channel in **5 seconds**...`
  });

  try {
    // 1. Fetch channel messages for transcript
    let fetchedMessages = new Map();
    try {
      fetchedMessages = await ticketChannel.messages.fetch({ limit: 100 });
    } catch (fetchErr) {
      console.error('[TICKET FETCH MESSAGES ERROR]', fetchErr);
    }

    // 2. Generate HTML transcript
    const htmlTranscript = generateHtmlTranscript(ticket, fetchedMessages, interaction.guild);
    const transcriptAttachment = new AttachmentBuilder(Buffer.from(htmlTranscript, 'utf8'), {
      name: `transcript-ticket-${ticket.ticketNum}.html`
    });

    const durationStr = ticket.createdAt ? formatDuration((Date.now() / 1000) - ticket.createdAt) : 'N/A';

    // 3. Post close log with attached transcript to # ⊘・ᴛɪᴄᴋᴇᴛ-ʟᴏɢꜱ
    await logTicketEvent(interaction.client, 'CLOSE', {
      ticketNum: ticket.ticketNum,
      categoryName: ticket.categoryName,
      userId: ticket.userId,
      userTag: ticket.userTag,
      claimedBy: ticket.claimedBy,
      claimedTag: ticket.claimedTag,
      closedBy: interaction.user.id,
      closedTag: interaction.user.tag,
      duration: durationStr,
      messageCount: fetchedMessages.size
    }, transcriptAttachment);

    // 4. Try to DM the ticket creator a copy of their transcript
    try {
      const creatorUser = await interaction.client.users.fetch(ticket.userId).catch(() => null);
      if (creatorUser) {
        const dmAttachment = new AttachmentBuilder(Buffer.from(htmlTranscript, 'utf8'), {
          name: `transcript-ticket-${ticket.ticketNum}.html`
        });
        await creatorUser.send({
          content: `📬 **Your Dream Nodes support ticket #${ticket.ticketNum} (${ticket.categoryName}) has been closed.**\nYour complete conversation transcript is attached below for your records:`,
          files: [dmAttachment]
        }).catch(() => null);
      }
    } catch (dmErr) {
      console.warn('[TICKET DM TRANSCRIPT ERROR]', dmErr.message);
    }

  } catch (err) {
    console.error('[TICKET CLOSE TRANSCRIPT ERROR]', err);
  }

  // Remove from active tickets
  if (data.activeTickets[ticketChannel.id]) {
    delete data.activeTickets[ticketChannel.id];
    saveTicketData(data);
  }

  // Delete channel after 5s countdown
  setTimeout(async () => {
    try {
      await ticketChannel.delete(`Ticket closed by ${interaction.user.tag}`);
    } catch (e) {
      console.error('[TICKET DELETE ERROR]', e);
    }
  }, 5000);
}

// Handle Ticket Close Cancellation
async function handleTicketCloseCancel(interaction) {
  await interaction.reply({
    content: 'Ticket closure cancelled. Channel remains open.',
    ephemeral: true
  });
}

module.exports = {
  CATEGORIES,
  STAFF_ROLES,
  HIGH_STAFF_ROLES,
  TICKET_LOGS_CHANNEL_ID,
  getTicketData,
  saveTicketData,
  buildTicketPanelPayload,
  handleTicketDepartmentSelect,
  handleTicketModalSubmit,
  handleTicketClaim,
  handleTicketClosePrompt,
  handleTicketCloseConfirm,
  handleTicketCloseCancel,
  logTicketEvent
};
