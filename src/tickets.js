const fs = require('fs');
const path = require('path');
const { OverwriteType, PermissionFlagsBits } = require('discord.js');

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

const CATEGORIES = {
  ticket_buy: {
    key: 'buy',
    name: 'Buy / Purchase Hosting',
    categoryId: '1573281628438921246', // ✦----- BUY TICKETS -----✦
    emoji: '<a:cash:1573382269735805008>',
    emojiObj: { id: '1573382269735805008', name: 'cash', animated: true },
    desc: 'Order Minecraft nodes, VPS, RDP, Web or Bot hosting'
  },
  ticket_queries: {
    key: 'queries',
    name: 'General Queries & Inquiries',
    categoryId: '1573773163605659768', // ✦----- QUERY TICKETS -----✦
    emoji: '<a:chat:1573382277164040214>',
    emojiObj: { id: '1573382277164040214', name: 'chat', animated: true },
    desc: 'Ask about server specs, custom builds, locations or billing'
  },
  ticket_staff_report: {
    key: 'report',
    name: 'Staff Misconduct Report',
    categoryId: '1573773165539233852', // ✦----- STAFF REPORTS -----✦
    emoji: '<a:siren:1573382431065509981>',
    emojiObj: { id: '1573382431065509981', name: 'siren', animated: true },
    desc: 'Confidential report sent directly to executive management',
    highStaffOnly: true
  },
  ticket_problems: {
    key: 'problems',
    name: 'Technical Problems & Issues',
    categoryId: '1573773168177582142', // ✦----- PROBLEM TICKETS -----✦
    emoji: '<a:settings:1573382421611806763>',
    emojiObj: { id: '1573382421611806763', name: 'settings', animated: true },
    desc: 'Report server offline, node downtime, bugs or control panel help'
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
> ✦ **Provide Full Details:** State your plan, node location, or invoice ID immediately upon opening.
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

// Handle Ticket Creation from Select Menu
async function handleTicketCreate(interaction) {
  // 1. Immediately defer reply so Discord Gateway never times out
  try {
    await interaction.deferReply({ ephemeral: true });
  } catch (deferErr) {
    console.error('[TICKET DEFER ERROR]', deferErr);
  }

  const selectedValue = interaction.values?.[0];
  const catConfig = CATEGORIES[selectedValue];
  if (!catConfig) {
    return interaction.editReply({
      content: '⚠️ Unknown department selected. Please try again.'
    });
  }

  const data = getTicketData();

  // Prevent multiple active tickets in the same category by the same user
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

    // Format requested by user: [Ticket Number]-Categoryname-claimed byname
    // (Initial state before claimed: unclaimed)
    const channelName = `〔${ticketNum}〕-${catConfig.key}-unclaimed`;

    // Roles to grant channel view
    const rolesToGrant = catConfig.highStaffOnly ? HIGH_STAFF_ROLES : STAFF_ROLES;

    // Use explicit OverwriteType and PermissionFlagsBits to prevent InvalidType cache errors
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
      createdAt: Math.floor(Date.now() / 1000)
    };
    saveTicketData(data);

    // Build the cool welcoming message inside the new ticket channel
    const welcomeHeader =
`# 🎫 Dʀᴇᴀᴍ Nᴏᴅᴇs ┃ Ticket #${ticketNum}
### <a:sparkles_sparkles:1573382447603785928> Welcome <@${interaction.user.id}>! Support Initialized

> <a:Rotating_Star:1573382194020491317> **Thank you for contacting Dream Nodes Support!**
> Our support team has been notified and will be with you shortly.
> 
> 📝 **Please describe your request or issue in detail:**
> ✦ **Department:** \`${catConfig.name}\`
> ✦ **Product / Service:** (Minecraft, Intel / AMD VPS, RDP, Web Hosting, Bot, Domain)
> ✦ **Details:** Please write your questions, desired plans, or problem description below. Feel free to provide screenshots, transaction IDs, or error logs!
> 
> ⏳ **Please wait patiently:** Our staff will claim this ticket soon. Avoid spamming pings so we can assist everyone swiftly.`;

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

    // Notify user with link to ticket
    await interaction.editReply({
      content: `✅ Your **${catConfig.name}** ticket has been created! Click here to jump to your ticket: <#${ticketChannel.id}>`
    });

  } catch (err) {
    console.error('[TICKET CREATE ERROR]', err);
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
    content: '⚠️ **Are you sure you want to close and delete this ticket channel?**',
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

// Handle Ticket Close Confirmation
async function handleTicketCloseConfirm(interaction) {
  const ticketChannel = interaction.channel;
  const data = getTicketData();
  const ticket = data.activeTickets[ticketChannel.id];

  await interaction.reply({
    content: `🔒 **Ticket closed by <@${interaction.user.id}>.** This channel will automatically delete in **5 seconds**...`
  });

  if (ticket) {
    delete data.activeTickets[ticketChannel.id];
    saveTicketData(data);
  }

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
  getTicketData,
  saveTicketData,
  buildTicketPanelPayload,
  handleTicketCreate,
  handleTicketClaim,
  handleTicketClosePrompt,
  handleTicketCloseConfirm,
  handleTicketCloseCancel
};
