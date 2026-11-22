const fs = require('fs');
const path = require('path');
const { 
  OverwriteType, 
  PermissionFlagsBits, 
  EmbedBuilder, 
  AttachmentBuilder 
} = require('discord.js');
const { generateHtmlTranscript, formatDuration } = require('./transcript');
const { E, B } = require('./emojis');
const { buildV2Container, buildV2Alert } = require('./v2Containers');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const ticketsFile = path.join(dataDir, 'tickets.json');

const ticketBannerPath = path.join(__dirname, '..', 'assets', 'ticket_banner.jpg');
let ticketBannerBuf = null;
try {
  if (fs.existsSync(ticketBannerPath)) {
    ticketBannerBuf = fs.readFileSync(ticketBannerPath);
  }
} catch (e) {
  console.error('[TICKET BANNER CACHE ERROR]', e);
}

const counterFile = path.join(dataDir, 'ticket_counter.txt');
const historyFile = path.join(dataDir, 'ticket_history.json');

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

/**
 * Strictly monotonic ticket number allocator.
 * Guarantees a ticket number is NEVER reused once issued.
 */
function getNextTicketNumber() {
  const data = getTicketData();
  let currentCounter = Number(data.counter) || 1;

  if (fs.existsSync(counterFile)) {
    try {
      const val = parseInt(fs.readFileSync(counterFile, 'utf8').trim(), 10);
      if (!isNaN(val) && val > currentCounter) {
        currentCounter = val;
      }
    } catch (e) {}
  }

  if (data.activeTickets) {
    for (const t of Object.values(data.activeTickets)) {
      const n = parseInt(t.ticketNum, 10);
      if (!isNaN(n) && n >= currentCounter) {
        currentCounter = n + 1;
      }
    }
  }

  let history = [];
  if (fs.existsSync(historyFile)) {
    try {
      history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
      if (Array.isArray(history)) {
        for (const h of history) {
          const n = parseInt(h, 10);
          if (!isNaN(n) && n >= currentCounter) {
            currentCounter = n + 1;
          }
        }
      }
    } catch (e) {}
  }

  if (currentCounter < 4) {
    currentCounter = 4;
  }

  const allocatedNumber = currentCounter;
  const nextCounter = currentCounter + 1;

  // Persist synchronously to tickets.json, ticket_counter.txt, and ticket_history.json
  data.counter = nextCounter;
  saveTicketData(data);

  try {
    fs.writeFileSync(counterFile, String(nextCounter), 'utf8');
  } catch (e) {}

  try {
    if (!history.includes(allocatedNumber)) {
      history.push(allocatedNumber);
    }
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2), 'utf8');
  } catch (e) {}

  return String(allocatedNumber).padStart(4, '0');
}

const TICKET_LOGS_CHANNEL_ID = '1573780018834710548'; // ⊘・ᴛɪᴄᴋᴇᴛ-ʟᴏɢꜱ
const TICKET_SUPPORT_ROLE_ID = '1574114981048225953'; // ⋆｡°✩ ƚιƈƙҽƚ ʂυρρσɾƚ ✩°｡⋆
const FOUNDER_ROLE_ID = '1573412727383392427'; // ⋆｡°✩ ϝσυɳԃҽɾ ✩°｡⋆
const PAID_CLIENT_ROLE_ID = '1573412778620747886'; // ⋆｡°✩ ƈʅιҽɳƚ ✩°｡⋆
const REVIEWS_CHANNEL_ID = '1574120437938520187'; // # ✦・ʀᴇᴠɪᴇᴡꜱ

const CATEGORIES = {
  ticket_buy: {
    key: 'buy',
    name: 'Buy / Purchase Hosting',
    categoryId: '1573281628438921246', // ✦----- BUY TICKETS -----✦
    emoji: E.cash,
    emojiObj: B.cash,
    desc: 'Order Minecraft nodes, VPS, RDP, Web or Bot hosting',
    staffPingRoleId: TICKET_SUPPORT_ROLE_ID, // ⋆｡°✩ ƚιƈƙҽƚ ʂυρρσɾƚ ✩°｡⋆
    modalTitle: 'Order Hosting Services',
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
    emoji: E.chat,
    emojiObj: B.chat,
    desc: 'Ask about server specs, custom builds, locations or billing',
    staffPingRoleId: TICKET_SUPPORT_ROLE_ID, // ⋆｡°✩ ƚιƈƙҽƚ ʂυρρσɾƚ ✩°｡⋆
    modalTitle: 'General Inquiry & Pre-Sales',
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
    emoji: E.siren,
    emojiObj: B.siren,
    desc: 'Confidential report sent directly to executive management',
    highStaffOnly: true,
    staffPingRoleId: '1573412749986365500', // ⋆｡°✩ αԃɱιɳ ✩°｡⋆
    modalTitle: 'Confidential Staff Report',
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
    emoji: E.settings,
    emojiObj: B.settings,
    desc: 'Report server offline, node downtime, bugs or control panel help',
    staffPingRoleId: TICKET_SUPPORT_ROLE_ID, // ⋆｡°✩ ƚιƈƙҽƚ ʂυρρσɾƚ ✩°｡⋆
    modalTitle: 'Technical Problems & Support',
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
  FOUNDER_ROLE_ID,       // Founder
  '1573412731644805140', // CEO
  '1573412734698004550', // COO
  '1573412738074550514', // Manager
  '1573412741031530506', // Developer
  '1573412746689515770', // Sysadmin
  '1573412749986365500', // Admin
  '1573412753073381477', // Head Mod
  '1573412756286214306', // Mod
  '1573412759532732567', // Support
  TICKET_SUPPORT_ROLE_ID,// Ticket Support
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
        .map(a => `> ${E.arrowBlue} **${a.label}:** \`${a.value}\``)
        .join('\n');

      const embed = new EmbedBuilder()
        .setTitle(`Ticket Opened: #${data.ticketNum}`)
        .setColor([67, 181, 129]) // Discord Green
        .setDescription(
          `${E.pin} **Category:** \`${data.categoryName}\`\n` +
          `${E.membership} **Opened By:** <@${data.userId}> (\`${data.userTag}\` ┃ \`${data.userId}\`)\n` +
          `${E.location} **Channel:** <#${data.channelId}>\n` +
          `${E.timer} **Opened At:** <t:${Math.floor(Date.now() / 1000)}:F> (<t:${Math.floor(Date.now() / 1000)}:R>)\n\n` +
          `### ${E.updates} Submitted Intake Details:\n` +
          (intakeSummary || '> *None provided*')
        )
        .setFooter({ text: `Dream Nodes Tickets • Ticket #${data.ticketNum}` })
        .setTimestamp();

      await logsChannel.send({ embeds: [embed] });
    } else if (eventType === 'CLAIM') {
      const embed = new EmbedBuilder()
        .setTitle(`Ticket Claimed: #${data.ticketNum}`)
        .setColor([250, 166, 26]) // Discord Amber
        .setDescription(
          `${E.pin} **Category:** \`${data.categoryName}\`\n` +
          `${E.staff} **Claimed By:** <@${data.claimedBy}> (\`${data.claimedTag}\`)\n` +
          `${E.membership} **Ticket Creator:** <@${data.userId}> (\`${data.userTag}\`)\n` +
          `${E.location} **Channel:** <#${data.channelId}>\n` +
          `${E.timer} **Claimed At:** <t:${Math.floor(Date.now() / 1000)}:R>`
        )
        .setFooter({ text: `Dream Nodes Tickets • Ticket #${data.ticketNum}` })
        .setTimestamp();

      await logsChannel.send({ embeds: [embed] });
    } else if (eventType === 'CLOSE') {
      const embed = new EmbedBuilder()
        .setTitle(`Ticket Closed: #${data.ticketNum}`)
        .setColor([240, 71, 71]) // Discord Red
        .setDescription(
          `${E.pin} **Category:** \`${data.categoryName}\`\n` +
          `${E.membership} **Opened By:** <@${data.userId}> (\`${data.userTag}\`)\n` +
          `${E.staff} **Claimed By:** ${data.claimedBy ? `<@${data.claimedBy}> (\`${data.claimedTag}\`)` : '`Unclaimed`'}\n` +
          `${E.cross} **Closed By:** <@${data.closedBy}> (\`${data.closedTag}\`)\n` +
          `${E.timer} **Total Duration:** \`${data.duration}\`\n` +
          `${E.chat} **Total Messages:** \`${data.messageCount}\`\n\n` +
          `${E.updates} **Transcript:** The full conversation history has been archived and uploaded below as an HTML transcript.`
        )
        .setFooter({ text: `Dream Nodes Tickets • Ticket #${data.ticketNum}` })
        .setTimestamp();

      const options = { embeds: [embed] };
      if (attachment) {
        options.files = [attachment];
      }
      await logsChannel.send(options);
    } else if (eventType === 'DEAL_DONE') {
      const embed = new EmbedBuilder()
        .setTitle(`Deal Completed: #${data.ticketNum}`)
        .setColor([46, 204, 113]) // Green
        .setDescription(
          `${E.pin} **Category:** \`${data.categoryName}\`\n` +
          `${E.staff} **Founder:** <@${data.founderId}> (\`${data.founderTag}\`)\n` +
          `${E.membership} **Client:** <@${data.userId}> (\`${data.userTag}\`)\n` +
          `${E.verifiedBlue} **Client Role Granted:** <@&${PAID_CLIENT_ROLE_ID}>\n` +
          `${E.chat} **Review DM Dispatched:** ${data.dmSent ? 'Yes' : 'No (DMs Closed)'}\n` +
          `${E.location} **Channel:** <#${data.channelId}>\n` +
          `${E.timer} **Completed At:** <t:${Math.floor(Date.now() / 1000)}:R>`
        )
        .setFooter({ text: `Dream Nodes Tickets • Ticket #${data.ticketNum}` })
        .setTimestamp();

      await logsChannel.send({ embeds: [embed] });
    }
  } catch (err) {
    console.error('[TICKET LOG EVENT ERROR]', err);
  }
}

// Build the Main Ticket Panel Components V2 Payload
function buildTicketPanelPayload() {
  const panelHeader =
`# ${E.ticket} **DREAM NODES ┃ Client Support & Helpdesk**\n` +
`> ${E.fireWorld} 24/7 dedicated client assistance, custom order quotes & technical resolutions.`;

  const departmentsBlock =
`### ${E.support} **Available Helpdesk Departments**\n` +
`> ${E.cash} **Purchase Hosting:** Order Minecraft, Intel / AMD VPS, RDP, or Bot Nodes.\n` +
`> \n` +
`> ${E.chat} **General & Billing Queries:** Inquire about node specifications, billing, or custom plans.\n` +
`> \n` +
`> ${E.settings} **Technical Problems & Outages:** Report server crashes, node downtime, or SFTP issues.\n` +
`> \n` +
`> ${E.shield} **Staff Report & Leadership:** Confidentially escalate matters directly to Founders.`;

  const guidelinesBlock =
`### ${E.rulesBook} **Helpdesk Guidelines**\n` +
`> ${E.arrowBlue} **One Ticket Per Topic:** Please avoid creating duplicate tickets for the same inquiry.\n` +
`> \n` +
`> ${E.arrowBlue} **Provide Intake Details:** Fill out the popup modal accurately for rapid response.\n` +
`> \n` +
`> ${E.arrowBlue} **Staff Alert:** Support engineers are notified automatically upon creation.`;

  return {
    flags: 32768, // IS_COMPONENTS_V2
    content: '',
    embeds: [],
    attachments: [{ id: 0, filename: 'ticket_banner.jpg' }],
    components: [
      {
        type: 17, // Borderless Container
        accent_color: null,
        components: [
          // 1. Header
          {
            type: 10,
            content: panelHeader
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
                  url: 'attachment://ticket_banner.jpg'
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
          // 5. Departments
          {
            type: 10,
            content: departmentsBlock
          },
          // 6. Divider
          {
            type: 14,
            divider: true,
            spacing: 1
          },
          // 7. Action Row for Select Menu
          {
            type: 1,
            components: [
              {
                type: 3, // String Select Menu
                custom_id: 'ticket_create_menu',
                placeholder: 'Select a department to open your ticket...',
                options: Object.entries(CATEGORIES).map(([val, cat]) => ({
                  label: cat.name,
                  value: val,
                  description: cat.desc,
                  emoji: cat.emojiObj
                }))
              }
            ]
          },
          // 8. Divider
          {
            type: 14,
            divider: true,
            spacing: 1
          },
          // 9. Guidelines
          {
            type: 10,
            content: guidelinesBlock
          },
          // 10. Divider
          {
            type: 14,
            divider: true,
            spacing: 1
          },
          // 11. Action Row for Direct Links
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 5,
                label: 'Official Website',
                url: 'https://dreamnodes.cloud',
                emoji: B.fireWorld
              },
              {
                type: 2,
                style: 5,
                label: 'How To Buy',
                url: 'https://discord.com/channels/1573272872737181696/1573281597464121425',
                emoji: B.info
              },
              {
                type: 2,
                style: 5,
                label: 'Terms & Policies',
                url: 'https://discord.com/channels/1573272872737181696/1573337303538208778',
                emoji: B.rulesBook
              }
            ]
          },
          // 12. Footer
          {
            type: 10,
            content: `-# ${E.verifiedBlue} Dream Nodes • Dedicated 24/7 Client Helpdesk • Rapid SLA Response`
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
      content: 'Unknown department selected. Please try again.',
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
        content: `You already have an open ticket in this department: <#${existingTicket.channelId}>. Please use that channel or close it before creating a new one.`,
        ephemeral: true
      });
    } else {
      delete data.activeTickets[existingTicket.channelId];
      saveTicketData(data);
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
      content: 'Unknown department form submitted. Please try again.'
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
        content: `You already have an open ticket in this department: <#${existingTicket.channelId}>. Please use that channel or close it before creating a new one.`
      });
    } else {
      delete data.activeTickets[existingTicket.channelId];
      saveTicketData(data);
    }
  }

  try {
    const ticketNum = getNextTicketNumber();

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

    // Format requested by user: number-category-claimedby (unclaimed before being claimed)
    const channelName = `${ticketNum}-${catConfig.key}-unclaimed`;

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
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.MentionEveryone
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
      content: `${E.announce} <@&${staffPingRole}> • New **${catConfig.name}** ticket opened by <@${interaction.user.id}>!`
    });

    // 2. Format the user's intake questions & answers cleanly
    const intakeFormatted = intakeAnswers.map(ans => `> ${E.arrowBlue} **${ans.label}:** \`${ans.value}\``).join('\n');

    // 3. Build the aesthetic welcoming Components V2 message inside the new ticket channel
    const welcomeHeader =
`# ${E.ticket} **DREAM NODES ┃ Ticket #${ticketNum}**\n` +
`### ${E.sparkles} Welcome <@${interaction.user.id}>! Support Desk Initialized\n\n` +
`> ${E.fireWorld} **Thank you for reaching out to Dream Nodes Client Care.**\n` +
`> A verified support engineer will claim your ticket shortly. Feel free to provide relevant error logs, screenshots, or invoice IDs below to accelerate your inquiry.\n` +
`> \n` +
`> ${E.timer} **Response Notice:** Staff are notified in real-time. Please avoid repetitive pings.`;

    const ticketComponents = [
      {
        type: 10,
        content: welcomeHeader
      },
      {
        type: 14,
        divider: true,
        spacing: 1
      }
    ];

    if (ticketBannerBuf) {
      ticketComponents.push(
        {
          type: 12,
          items: [
            {
              media: {
                url: 'attachment://ticket_banner.jpg'
              }
            }
          ]
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        }
      );
    }

    ticketComponents.push(
      {
        type: 10,
        content:
          `### ${E.rulesBook} **Intake Information Provided:**\n` +
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
          `### ${E.settings} **Ticket Information & Session Status**\n` +
          `> ${E.pin} **Department:** \`${catConfig.name}\` ┃ ${E.membership} **Opened By:** <@${interaction.user.id}>\n` +
          `> ${E.staff} **Claim Status:** \`Unclaimed\` *(Awaiting staff member)*`
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
            emoji: B.tick5
          },
          {
            type: 2,
            style: 2, // Secondary / Grey
            label: 'Ping Founder',
            custom_id: `ticket_ping_founder_${ticketChannel.id}`,
            emoji: B.crown
          },
          {
            type: 2,
            style: 4, // Danger / Red
            label: 'Close Ticket',
            custom_id: `ticket_close_${ticketChannel.id}`,
            emoji: B.cross
          },
          ...(catConfig.key === 'buy' ? [
            {
              type: 2,
              style: 3, // Success / Green
              label: 'Deal Done',
              custom_id: `ticket_deal_done_${ticketChannel.id}`,
              emoji: B.cash
            }
          ] : [])
        ]
      },
      {
        type: 10,
        content: `-# ${E.verifiedBlue} Dream Nodes • 24/7 Dedicated Client Support Helpdesk • Rapid SLA Response`
      }
    );

    const ticketMessagePayload = {
      flags: 32768, // IS_COMPONENTS_V2
      content: '',
      embeds: [],
      ...(ticketBannerBuf ? { attachments: [{ id: 0, filename: 'ticket_banner.jpg' }] } : {}),
      components: [
        {
          type: 17, // Borderless Container
          accent_color: null,
          components: ticketComponents
        }
      ]
    };

    const botAuthToken = process.env.DISCORD_TOKEN || interaction.client.token;
    if (ticketBannerBuf) {
      const formData = new FormData();
      formData.append('files[0]', new File([ticketBannerBuf], 'ticket_banner.jpg', { type: 'image/jpeg' }));
      formData.append('payload_json', JSON.stringify(ticketMessagePayload));

      await fetch(`https://discord.com/api/v10/channels/${ticketChannel.id}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bot ${botAuthToken}`
        },
        body: formData
      });
    } else {
      await fetch(`https://discord.com/api/v10/channels/${ticketChannel.id}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bot ${botAuthToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticketMessagePayload)
      });
    }

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
      content: `${E.tick5} Your **${catConfig.name}** ticket has been created! Click here to jump to your ticket: <#${ticketChannel.id}>`
    });

  } catch (err) {
    console.error('[TICKET MODAL SUBMIT ERROR]', err);
    await interaction.editReply({
      content: 'Failed to create support ticket. Please contact an administrator.'
    });
  }
}

// Handle Staff Claiming a Ticket
async function handleTicketClaim(interaction) {
  const ticketChannel = interaction.channel;
  const data = getTicketData();
  const ticket = data.activeTickets[ticketChannel.id];

  if (!ticket) {
    return interaction.reply(buildV2Alert({
      title: 'Invalid Ticket',
      message: 'This channel is not recognized as an active ticket.',
      type: 'error',
      ephemeral: true
    }));
  }

  // Permission check
  const isHighStaff = isStaff(interaction.member, true);
  const isGeneralStaff = isStaff(interaction.member, false);

  if (ticket.categoryKey === 'report' && !isHighStaff) {
    return interaction.reply(buildV2Alert({
      title: 'Restricted Category',
      message: 'Staff Reports can only be claimed by Executive Staff (Admin / Manager / CEO / Founder).',
      type: 'warning',
      ephemeral: true
    }));
  }

  if (!isGeneralStaff) {
    return interaction.reply(buildV2Alert({
      title: 'Staff Only Action',
      message: 'Only verified Dream Nodes staff members can claim support tickets.',
      type: 'error',
      ephemeral: true
    }));
  }

  if (ticket.claimedBy) {
    return interaction.reply(buildV2Alert({
      title: 'Ticket Already Claimed',
      message: `This ticket has already been claimed by <@${ticket.claimedBy}>.`,
      type: 'info',
      ephemeral: true
    }));
  }

  const staffSlug = interaction.user.username.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 15) || 'staff';
  const newChannelName = `${ticket.ticketNum}-${ticket.categoryKey}-${staffSlug}`;

  ticket.claimedBy = interaction.user.id;
  ticket.claimedTag = interaction.user.tag;
  saveTicketData(data);

  try {
    await ticketChannel.setName(newChannelName, `Ticket claimed by ${interaction.user.tag}`);

    // Post claim announcement in ticket channel (V2 Container)
    const claimNotice = buildV2Container({
      title: `### ${E.staff} Ticket Claimed`,
      subtitle: `${E.sparkles} Support staff assigned to this case.`,
      description:
        `> ${E.staff} **Assigned Specialist:** <@${interaction.user.id}>\n` +
        `> ${E.lightning} **Status:** In Progress • Active Support\n` +
        `> ${E.chat} Your specialist is reviewing your inquiry and will message below.`,
      footer: `-# ${E.ticket} Dream Nodes • Dedicated Support Desk`,
      ephemeral: false
    });
    await ticketChannel.send({ flags: claimNotice.flags, components: claimNotice.components });

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

    await interaction.reply(buildV2Alert({
      title: 'Ticket Claimed',
      message: `You have successfully claimed ticket **#${ticket.ticketNum}**! Channel updated to \`${newChannelName}\`.`,
      type: 'success',
      ephemeral: true
    }));
  } catch (err) {
    console.error('[TICKET CLAIM ERROR]', err);
    await interaction.reply(buildV2Alert({
      title: 'Ticket Claimed (Partial)',
      message: 'Claim recorded, though channel rename hit a rate limit.',
      type: 'info',
      ephemeral: true
    }));
  }
}

// Handle Ticket Close Button Click (Show Confirmation)
async function handleTicketClosePrompt(interaction) {
  const data = getTicketData();
  const ticket = data.activeTickets[interaction.channelId];

  if (!ticket) {
    return interaction.reply({
      content: 'This channel is not recognized as an active ticket.',
      ephemeral: true
    });
  }

  // Ask for confirmation before deleting
  const confirmPayload = {
    content: `${E.alert} **Are you sure you want to close and archive this ticket channel?**\nA full transcript will be saved to the ticket logs channel.`,
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 4, // Danger / Red
            label: 'Confirm Close',
            custom_id: `ticket_close_confirm_${interaction.channelId}`,
            emoji: B.cross
          },
          {
            type: 2,
            style: 2, // Secondary / Grey
            label: 'Cancel',
            custom_id: `ticket_close_cancel_${interaction.channelId}`,
            emoji: B.tick5
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
    content: `${E.security} **Ticket closed by <@${interaction.user.id}>.** Saving transcript and deleting channel in **5 seconds**...`
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
          content: `${E.ticket} **Your Dream Nodes support ticket #${ticket.ticketNum} (${ticket.categoryName}) has been closed.**\nYour complete conversation transcript is attached below for your records:`,
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
  await interaction.reply(buildV2Alert({
    title: 'Closure Cancelled',
    message: 'Ticket closure was cancelled. This support channel will remain open.',
    type: 'success',
    ephemeral: true
  }));
}

// Handle Pinging Founders inside a Ticket Channel (Staff / Ticket Support only)
async function handleTicketPingFounder(interaction) {
  const ticketChannel = interaction.channel;
  const data = getTicketData();
  const ticket = data.activeTickets[ticketChannel.id];

  const isTicketCategory = Object.values(CATEGORIES).some(cat => cat.categoryId === ticketChannel.parentId);
  const isTicketChannel = Boolean(ticket) || isTicketCategory || ticketChannel.name.includes('ticket') || /^\d{4}-/.test(ticketChannel.name) || ticketChannel.name.includes('〔');

  if (!isTicketChannel) {
    return interaction.reply(buildV2Alert({
      title: 'Invalid Channel',
      message: 'This command can only be performed inside an active support ticket channel.',
      type: 'error',
      ephemeral: true
    }));
  }

  if (!isStaff(interaction.member)) {
    return interaction.reply(buildV2Alert({
      title: 'Staff Only Action',
      message: 'Only verified Ticket Support staff members can request Founder assistance.',
      type: 'error',
      ephemeral: true
    }));
  }

  try {
    // Post founder escalation alert in the ticket channel (V2 Container)
    const founderAlertPayload = buildV2Container({
      title: `# ${E.crown} ${E.siren} Founder Escalation Requested`,
      subtitle: `${E.staff} Staff member <@${interaction.user.id}> has requested immediate Founder intervention.`,
      description:
        `> ${E.arrowBlue} **Target Attention:** <@&${FOUNDER_ROLE_ID}>\n` +
        `> ${E.lightning} **Priority Tier:** Urgent Escalation\n` +
        `> ${E.sparkles} A server Founder has been pinged and will inspect this ticket channel shortly.`,
      footer: `-# ${E.crown} Dream Nodes • Executive Management Escalation`,
      ephemeral: false
    });

    // Send mention first, then V2 container with empty content to comply with Discord API
    await ticketChannel.send({ content: `<@&${FOUNDER_ROLE_ID}>` });
    await ticketChannel.send({
      content: '',
      flags: founderAlertPayload.flags,
      components: founderAlertPayload.components
    });

    await interaction.reply(buildV2Alert({
      title: 'Founders Notified',
      message: 'Founders have been notified with high priority for this ticket.',
      type: 'success',
      ephemeral: true
    }));
  } catch (err) {
    console.error('[TICKET PING FOUNDER ERROR]', err);
    await interaction.reply(buildV2Alert({
      title: 'Escalation Error',
      message: `Failed to ping founders: \`${err.message}\``,
      type: 'error',
      ephemeral: true
    }));
  }
}

// Handle /add Slash Command
async function handleTicketAddUser(interaction) {
  const ticketChannel = interaction.channel;
  const targetUser = interaction.options.getUser('user');

  if (!targetUser) {
    return interaction.reply(buildV2Alert({
      title: 'Invalid User',
      message: 'Please specify a valid Discord user to add to this ticket.',
      type: 'error',
      ephemeral: true
    }));
  }

  const data = getTicketData();
  const ticket = data.activeTickets[ticketChannel.id];

  const isTicketCategory = Object.values(CATEGORIES).some(cat => cat.categoryId === ticketChannel.parentId);
  const isTicketChannel = Boolean(ticket) || isTicketCategory || ticketChannel.name.includes('ticket') || /^\d{4}-/.test(ticketChannel.name) || ticketChannel.name.includes('〔');

  if (!isTicketChannel) {
    return interaction.reply(buildV2Alert({
      title: 'Invalid Channel',
      message: 'The `/add` command can only be used inside active ticket channels.',
      type: 'error',
      ephemeral: true
    }));
  }

  const isStaffMember = isStaff(interaction.member);
  const isCreator = ticket && ticket.userId === interaction.user.id;

  if (!isStaffMember && !isCreator) {
    return interaction.reply(buildV2Alert({
      title: 'Access Denied',
      message: 'Only ticket creators and Ticket Support staff have permission to add members to this ticket.',
      type: 'error',
      ephemeral: true
    }));
  }

  // Check if target is already in the channel
  const existingOverwrite = ticketChannel.permissionOverwrites.cache.get(targetUser.id);
  if (existingOverwrite && existingOverwrite.allow.has(PermissionFlagsBits.ViewChannel)) {
    return interaction.reply(buildV2Alert({
      title: 'Member Already Present',
      message: `<@${targetUser.id}> already has access to this ticket channel.`,
      type: 'info',
      ephemeral: true
    }));
  }

  try {
    await ticketChannel.permissionOverwrites.edit(targetUser.id, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
      AttachFiles: true,
      EmbedLinks: true,
      AddReactions: true
    });

    if (ticket) {
      ticket.addedUsers = ticket.addedUsers || [];
      if (!ticket.addedUsers.includes(targetUser.id)) {
        ticket.addedUsers.push(targetUser.id);
        saveTicketData(data);
      }
    }

    const addV2Payload = buildV2Container({
      title: `### ${E.tick5} Member Added to Ticket`,
      subtitle: `${E.sparkles} Ticket access permissions granted.`,
      description:
        `> ${E.arrowBlue} **Member Added:** <@${targetUser.id}> (\`${targetUser.tag}\`)\n` +
        `> ${E.staff} **Authorized By:** <@${interaction.user.id}>\n` +
        `> ${E.security} **Permissions:** View channel, read message history, and participate in discussion.`,
      footer: `-# ${E.ticket} Dream Nodes • Ticket Access Management`,
      ephemeral: false
    });

    await interaction.reply(addV2Payload);
  } catch (err) {
    console.error('[TICKET ADD USER ERROR]', err);
    await interaction.reply(buildV2Alert({
      title: 'Add Member Error',
      message: `Failed to add user to ticket: \`${err.message}\``,
      type: 'error',
      ephemeral: true
    }));
  }
}

// Handle /remove Slash Command
async function handleTicketRemoveUser(interaction) {
  const ticketChannel = interaction.channel;
  const targetUser = interaction.options.getUser('user');

  if (!targetUser) {
    return interaction.reply(buildV2Alert({
      title: 'Invalid User',
      message: 'Please specify a valid Discord user to remove from this ticket.',
      type: 'error',
      ephemeral: true
    }));
  }

  const data = getTicketData();
  const ticket = data.activeTickets[ticketChannel.id];

  const isTicketCategory = Object.values(CATEGORIES).some(cat => cat.categoryId === ticketChannel.parentId);
  const isTicketChannel = Boolean(ticket) || isTicketCategory || ticketChannel.name.includes('ticket') || /^\d{4}-/.test(ticketChannel.name) || ticketChannel.name.includes('〔');

  if (!isTicketChannel) {
    return interaction.reply(buildV2Alert({
      title: 'Invalid Channel',
      message: 'The `/remove` command can only be used inside active ticket channels.',
      type: 'error',
      ephemeral: true
    }));
  }

  const isStaffMember = isStaff(interaction.member);
  const isCreator = ticket && ticket.userId === interaction.user.id;

  if (!isStaffMember && !isCreator) {
    return interaction.reply(buildV2Alert({
      title: 'Access Denied',
      message: 'Only ticket creators and Ticket Support staff have permission to remove members from this ticket.',
      type: 'error',
      ephemeral: true
    }));
  }

  if (ticket && targetUser.id === ticket.userId) {
    return interaction.reply(buildV2Alert({
      title: 'Action Prohibited',
      message: 'Cannot remove the original ticket creator from their own ticket.',
      type: 'warning',
      ephemeral: true
    }));
  }

  try {
    await ticketChannel.permissionOverwrites.delete(targetUser.id);

    if (ticket && ticket.addedUsers) {
      ticket.addedUsers = ticket.addedUsers.filter(id => id !== targetUser.id);
      saveTicketData(data);
    }

    const removeV2Payload = buildV2Container({
      title: `### ${E.cross} Member Removed from Ticket`,
      subtitle: `${E.security} Ticket access permissions revoked.`,
      description:
        `> ${E.arrowBlue} **Member Removed:** <@${targetUser.id}> (\`${targetUser.tag}\`)\n` +
        `> ${E.staff} **Removed By:** <@${interaction.user.id}>\n` +
        `> ${E.security} **Status:** Channel view override cleared.`,
      footer: `-# ${E.ticket} Dream Nodes • Ticket Access Management`,
      ephemeral: false
    });

    await interaction.reply(removeV2Payload);
  } catch (err) {
    console.error('[TICKET REMOVE USER ERROR]', err);
    await interaction.reply(buildV2Alert({
      title: 'Remove Member Error',
      message: `Failed to remove user from ticket: \`${err.message}\``,
      type: 'error',
      ephemeral: true
    }));
  }
}

/**
 * Handle "Deal Done" button click inside Buy Category Tickets.
 * Restricted strictly to Server Founders.
 * Grants Paid Client role, sends DM thanking client & prompting review in reviews channel,
 * and posts confirmation inside ticket channel.
 */
async function handleTicketDealDone(interaction) {
  const ticketChannel = interaction.channel;
  const data = getTicketData();
  const ticket = data.activeTickets[ticketChannel.id];

  if (!ticket) {
    return interaction.reply(buildV2Alert({
      title: 'Invalid Ticket',
      message: 'This channel is not recognized as an active ticket.',
      type: 'error',
      ephemeral: true
    }));
  }

  // Permission check: STRICTLY restricted to Server Founders (or Server Owner)
  const isFounder = interaction.member.roles?.cache?.has(FOUNDER_ROLE_ID) || 
                    interaction.guild.ownerId === interaction.user.id;

  if (!isFounder) {
    return interaction.reply(buildV2Alert({
      title: 'Founder Only Action',
      message: 'Only server Founders have permission to finalize orders and grant the Client role.',
      type: 'error',
      ephemeral: true
    }));
  }

  if (ticket.dealDone) {
    return interaction.reply(buildV2Alert({
      title: 'Deal Already Completed',
      message: `This order was already finalized by <@${ticket.dealDoneBy}> on <t:${ticket.dealDoneAt}:f>.`,
      type: 'info',
      ephemeral: true
    }));
  }

  // Defer reply immediately so Discord Gateway never times out
  await interaction.deferReply({ ephemeral: true });

  let roleGranted = false;
  let clientUser = null;
  let dmDelivered = false;

  // 1. Grant Paid Client Role to ticket creator
  try {
    const member = await interaction.guild.members.fetch(ticket.userId).catch(() => null);
    if (member) {
      if (!member.roles.cache.has(PAID_CLIENT_ROLE_ID)) {
        await member.roles.add(PAID_CLIENT_ROLE_ID, `Deal marked done by Founder ${interaction.user.tag}`);
      }
      roleGranted = true;
    }
  } catch (err) {
    console.error('[DEAL DONE ROLE ERROR]', err);
  }

  // 2. Send thank-you and review reminder DM to the customer
  try {
    clientUser = await interaction.client.users.fetch(ticket.userId).catch(() => null);
    if (clientUser) {
      const dmEmbed = new EmbedBuilder()
        .setTitle(`${E.cash} Thank You for Buying Our Service!`)
        .setColor([88, 101, 242]) // Blurple
        .setDescription(
          `### ${E.sparkles} Welcome to Dream Nodes!\n\n` +
          `> ${E.fireWorld} **Dear <@${ticket.userId}>,**\n` +
          `> Thanks for buying our service! Your order has been fulfilled, and you have officially been granted the **Client** role in **Dream Nodes - Official**!\n\n` +
          `### ${E.chat} **Make Sure to Leave a Review!**\n` +
          `> We value your honest feedback! Please take a quick moment to drop a review of your experience with us in our client reviews channel: <#${REVIEWS_CHANNEL_ID}>.\n` +
          `> Your reviews help our community grow and allow us to maintain top-tier hardware and customer support.\n\n` +
          `*If you ever need any technical assistance, our support team is available 24/7.*`
        )
        .setFooter({ text: 'Dream Nodes • Client Care Team' })
        .setTimestamp();

      const dmActionRow = {
        type: 1,
        components: [
          {
            type: 2,
            style: 5,
            label: 'Leave a Review',
            url: `https://discord.com/channels/${interaction.guild.id}/${REVIEWS_CHANNEL_ID}`,
            emoji: B.sparkles
          },
          {
            type: 2,
            style: 5,
            label: 'Official Website',
            url: 'https://dreamnodes.cloud',
            emoji: B.fireWorld
          }
        ]
      };

      await clientUser.send({
        embeds: [dmEmbed],
        components: [dmActionRow]
      });
      dmDelivered = true;
    }
  } catch (dmErr) {
    console.warn('[DEAL DONE DM WARNING]', dmErr.message);
    dmDelivered = false;
  }

  // 3. Update ticket database entry
  ticket.dealDone = true;
  ticket.dealDoneBy = interaction.user.id;
  ticket.dealDoneTag = interaction.user.tag;
  ticket.dealDoneAt = Math.floor(Date.now() / 1000);
  saveTicketData(data);

  // 4. Send celebratory announcement in the ticket channel (V2 Container)
  const dealNotice = buildV2Container({
    title: `### ${E.cash} Order Finalized ┃ Deal Completed`,
    subtitle: `${E.sparkles} Founder <@${interaction.user.id}> has verified and completed this deal.`,
    description:
      `> ${E.membership} **Customer:** <@${ticket.userId}>\n` +
      `> ${E.verifiedBlue} **Client Role:** ${roleGranted ? `<@&${PAID_CLIENT_ROLE_ID}> (Assigned)` : '`Failed to assign role`'}\n` +
      `> ${E.staff} **Founder:** <@${interaction.user.id}>\n` +
      `> ${E.chat} **Customer DM:** ${dmDelivered ? `${E.tick5} Dispatched thank-you note & review reminder` : `${E.alert} DMs closed (could not deliver)`}\n\n` +
      `> ${E.sparkles} *Make sure to leave a review in <#${REVIEWS_CHANNEL_ID}>!*`,
    footer: `-# ${E.cash} Dream Nodes • Order Completion`,
    ephemeral: false
  });

  await ticketChannel.send({
    content: '',
    flags: dealNotice.flags,
    components: dealNotice.components
  });

  // 5. Log event to ticket logs channel
  await logTicketEvent(interaction.client, 'DEAL_DONE', {
    ticketNum: ticket.ticketNum,
    categoryName: ticket.categoryName,
    channelId: ticketChannel.id,
    userId: ticket.userId,
    userTag: ticket.userTag,
    founderId: interaction.user.id,
    founderTag: interaction.user.tag,
    dmSent: dmDelivered
  });

  // 6. Respond to Founder
  await interaction.editReply(buildV2Alert({
    title: 'Deal Completed',
    message: `Order marked as completed! Granted Client role to <@${ticket.userId}>.${dmDelivered ? ' Sent thank-you & review reminder DM.' : ' (Client has DMs closed).' }`,
    type: 'success',
    ephemeral: true
  }));
}

module.exports = {
  CATEGORIES,
  STAFF_ROLES,
  HIGH_STAFF_ROLES,
  TICKET_LOGS_CHANNEL_ID,
  TICKET_SUPPORT_ROLE_ID,
  FOUNDER_ROLE_ID,
  PAID_CLIENT_ROLE_ID,
  REVIEWS_CHANNEL_ID,
  getTicketData,
  saveTicketData,
  getNextTicketNumber,
  buildTicketPanelPayload,
  handleTicketDepartmentSelect,
  handleTicketModalSubmit,
  handleTicketClaim,
  handleTicketDealDone,
  handleTicketClosePrompt,
  handleTicketCloseConfirm,
  handleTicketCloseCancel,
  handleTicketPingFounder,
  handleTicketAddUser,
  handleTicketRemoveUser,
  logTicketEvent
};
