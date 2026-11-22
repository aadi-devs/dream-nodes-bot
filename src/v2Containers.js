const { E, B } = require('./emojis');

/**
 * Build a Discord Components V2 payload (type: 17 container)
 */
function buildV2Container({
  title,
  subtitle,
  description,
  sections = [],
  buttons = [],
  footer,
  accentColor = 0x00F0FF,
  ephemeral = false
}) {
  let content = '';

  if (title) {
    content += `${title}\n`;
  }
  if (subtitle) {
    content += `> ${subtitle}\n\n`;
  } else if (title) {
    content += '\n';
  }
  if (description) {
    content += `${description}\n\n`;
  }

  if (sections && sections.length > 0) {
    for (const sec of sections) {
      if (typeof sec === 'string') {
        content += `${sec}\n\n`;
      } else {
        if (sec.title) {
          content += `${sec.title}\n`;
        }
        if (sec.body) {
          content += `${sec.body}\n\n`;
        }
      }
    }
  }

  const components = [
    {
      type: 10, // Text Display
      content: content.trim()
    }
  ];

  if (buttons && buttons.length > 0) {
    components.push({
      type: 14, // Separator / Divider
      divider: true,
      spacing: 1
    });

    components.push({
      type: 1, // Action Row
      components: buttons.map(b => ({
        type: 2, // Button
        style: b.style !== undefined ? b.style : (b.url ? 5 : 2),
        label: b.label,
        url: b.url,
        custom_id: b.customId,
        emoji: b.emoji
      }))
    });
  }

  if (footer) {
    components.push({
      type: 10,
      content: footer.startsWith('-#') ? footer : `-# ${footer}`
    });
  }

  return {
    flags: ephemeral ? 32832 : 32768, // 32768 = IS_COMPONENTS_V2 | 64 = EPHEMERAL
    components: [
      {
        type: 17, // Borderless Container
        accent_color: accentColor,
        components
      }
    ]
  };
}

/**
 * Standardized Alert / Status Message in Components V2
 */
function buildV2Alert({
  title,
  message,
  type = 'info', // 'info' | 'success' | 'error' | 'warning'
  buttons = [],
  footer,
  ephemeral = true
}) {
  let icon = E.sparkles;
  let accentColor = 0x00F0FF;
  let defaultFooter = `-# ${E.sparkles} Dʀᴇᴀᴍ Nᴏᴅᴇs • Cloud Systems`;

  if (type === 'success') {
    icon = E.tick5;
    accentColor = 0x00FF88;
    defaultFooter = `-# ${E.verifiedBlue} Dʀᴇᴀᴍ Nᴏᴅᴇs • Verified Operation`;
  } else if (type === 'error') {
    icon = E.cross;
    accentColor = 0xFF3366;
    defaultFooter = `-# ${E.security} Dʀᴇᴀᴍ Nᴏᴅᴇs • Sentinel Security`;
  } else if (type === 'warning') {
    icon = E.alert;
    accentColor = 0xFFAA00;
    defaultFooter = `-# ${E.security} Dʀᴇᴀᴍ Nᴏᴅᴇs • Access Enforcement`;
  }

  const finalTitle = title ? (title.includes('<a:') ? title : `### ${icon} ${title}`) : '';
  const finalDescription = message ? (message.startsWith('>') ? message : `> ${message}`) : '';

  return buildV2Container({
    title: finalTitle,
    description: finalDescription,
    buttons,
    footer: footer || defaultFooter,
    accentColor,
    ephemeral
  });
}

/**
 * /ping Slash Command V2 Container
 */
function buildPingV2(wsPing, uptimeHours) {
  return buildV2Container({
    title: `# ${E.ping} Dʀᴇᴀᴍ Nᴏᴅᴇs ┃ Pᴏɴɢ!`,
    subtitle: `${E.sparkles} Real-time Discord Gateway & bot process connectivity.`,
    description:
      `> ${E.lightning} **Gateway Latency:** \`${wsPing}ms\`\n` +
      `> ${E.stats} **Cluster Status:** \`SYNCHRONIZED • HEALTHY\`\n` +
      `> ${E.clock} **Bot Uptime:** \`${uptimeHours}h\``,
    buttons: [
      {
        label: 'Client Panel',
        url: 'https://panel.dreamnodes.cloud',
        emoji: B.server
      },
      {
        label: 'Official Web',
        url: 'https://dreamnodes.cloud',
        emoji: B.world
      }
    ],
    footer: `-# ${E.verifiedBlue} Dʀᴇᴀᴍ Nᴏᴅᴇs • Operational Telemetry Synchronized`,
    accentColor: 0x00F0FF,
    ephemeral: true
  });
}

/**
 * /status Slash Command V2 Container
 */
function buildStatusV2({ wsPing, uptimeHours, memUsage }) {
  return buildV2Container({
    title: `# ${E.stats} Dʀᴇᴀᴍ Nᴏᴅᴇs ┃ Iɴꜰʀᴀꜱᴛʀᴜᴄᴛᴜʀᴇ Sᴛᴀᴛᴜꜱ`,
    subtitle: `${E.sparkles} Real-time operational telemetry for Dream Nodes hosting systems.`,
    sections: [
      {
        title: `### ${E.greenDot} Core Fleet Health`,
        body:
          `> ${E.tick5} **Fleet Status:** \`ALL OPERATIONAL (100%)\`\n` +
          `> ${E.lightning} **Gateway Ping:** \`${wsPing}ms\`\n` +
          `> ${E.clock} **Bot Uptime:** \`${uptimeHours}h\`\n` +
          `> ${E.gear} **Memory Heap:** \`${memUsage} MB\``
      },
      {
        title: `### ${E.server} Global Compute Clusters`,
        body:
          `> ${E.arrowBlue} **Node-US-East (Virginia):** \`Operational • 20.0 TPS\`\n` +
          `> ${E.arrowBlue} **Node-EU-Central (Frankfurt):** \`Operational • 20.0 TPS\`\n` +
          `> ${E.arrowBlue} **Node-SG-Asia (Singapore):** \`Operational • 20.0 TPS\``
      },
      {
        title: `### ${E.shield} Enterprise Network Protection`,
        body:
          `> ${E.security} **DDoS Mitigation:** \`Active • Multi-Tbps Scrubbing\`\n` +
          `> ${E.disk} **Storage Matrix:** \`Enterprise Gen4 NVMe RAID-10\``
      }
    ],
    buttons: [
      {
        label: 'Client Panel',
        url: 'https://panel.dreamnodes.cloud',
        emoji: B.server
      },
      {
        label: 'Official Website',
        url: 'https://dreamnodes.cloud',
        emoji: B.world
      },
      {
        label: 'Support Tickets',
        url: 'https://discord.com/channels/1573272872737181696/1573281601775870043',
        emoji: B.ticket
      }
    ],
    footer: `-# ${E.verifiedBlue} Dʀᴇᴀᴍ Nᴏᴅᴇs • developing solutions`,
    accentColor: 0x00F0FF,
    ephemeral: false
  });
}

/**
 * /plans Slash Command V2 Container
 */
function buildPlansV2() {
  return buildV2Container({
    title: `# ${E.clouds} Dʀᴇᴀᴍ Nᴏᴅᴇs ┃ Hᴏꜱᴛɪɴɢ Pʟᴀɴꜱ & Sᴇʀᴠɪᴄᴇꜱ`,
    subtitle: `${E.sparkles} High-performance game servers, enterprise VPS, and custom cloud compute.`,
    sections: [
      {
        title: `### ${E.minecraft} Minecraft Game Server Hosting`,
        body:
          `> ${E.arrowBlue} **Compute:** Intel Xeon & AMD Ryzen 9 high-frequency performance cores.\n` +
          `> ${E.arrowBlue} **Storage & Protection:** Unmetered Gen4 NVMe arrays, daily backups & L7 DDoS filters.\n` +
          `> ${E.arrowBlue} **Configurations:** Browse node plans & order in <#1573281486822445128>.`
      },
      {
        title: `### ${E.vps} Cloud Virtual Private Servers (VPS / VDS)`,
        body:
          `> ${E.arrowBlue} **Compute:** Dedicated AMD EPYC & Intel Xeon virtualization with full Root / SSH access.\n` +
          `> ${E.arrowBlue} **Transit:** Tier-1 multi-homed 10Gbps uplinks in US, Germany & Singapore.\n` +
          `> ${E.arrowBlue} **Configurations:** Browse VPS specifications in <#1573281509140336816>.`
      },
      {
        title: `### ${E.ticket} Bespoke Custom Deployments`,
        body:
          `> ${E.arrowBlue} **Enterprise:** Need private proxy routing, BGP transit, or dedicated game networks?\n` +
          `> ${E.arrowBlue} **Assistance:** Open a consultation ticket in <#1573281601775870043> to speak with Founders.`
      }
    ],
    buttons: [
      {
        label: 'Order Minecraft Hosting',
        url: 'https://dreamnodes.cloud',
        emoji: B.minecraft
      },
      {
        label: 'Deploy Cloud VPS',
        url: 'https://dreamnodes.cloud',
        emoji: B.clouds
      },
      {
        label: 'Open Support Ticket',
        url: 'https://discord.com/channels/1573272872737181696/1573281601775870043',
        emoji: B.ticket
      }
    ],
    footer: `-# ${E.verifiedBlue} Dream Nodes • Premium Cloud Infrastructure`,
    accentColor: 0x9D00FF,
    ephemeral: false
  });
}

/**
 * /testwelcome Slash Command V2 Container
 */
function buildTestWelcomeV2(channelId) {
  return buildV2Container({
    title: `### ${E.tick5} Welcome Dispatch Preview Sent!`,
    subtitle: `${E.sparkles} Interactive Discord Components V2 welcome container dispatched.`,
    description:
      `> ${E.arrowBlue} **Target Channel:** <#${channelId}>\n` +
      `> ${E.verifiedBlue} **Format:** Components V2 Container (\`flags: 32768\`) with live telemetry and animated buttons.\n` +
      `> ${E.starRotating} Head over to <#${channelId}> to verify the layout!`,
    buttons: [
      {
        label: 'View Welcome Channel',
        url: `https://discord.com/channels/1573272872737181696/${channelId}`,
        emoji: B.announce
      }
    ],
    footer: `-# ${E.sparkles} Dʀᴇᴀᴍ Nᴏᴅᴇs • Automated Onboarding Sentinel`,
    accentColor: 0x00FF88,
    ephemeral: true
  });
}

/**
 * Honeypot Kicks Log V2 Container
 */
function buildHoneypotLogsV2(logs) {
  const totalAttempts = logs.length;
  const totalKicks = logs.filter(l => l.action === 'KICKED').length;
  const immuneCount = logs.filter(l => l.action.startsWith('IMMUNE') || l.action.startsWith('FAILED')).length;

  let recentIncidents = '`No honeypot violations recorded yet. Server is clean and secure!`';
  if (logs.length > 0) {
    recentIncidents = logs.slice(-6).reverse().map((entry, idx) => {
      const time = `<t:${entry.timestamp}:R>`;
      const dmTag = entry.dmStatus === 'SENT' ? ` • ${E.tick5} DM: Delivered` : (entry.dmStatus ? ` • ${E.cross} DM: Closed` : '');
      if (entry.action === 'KICKED') {
        return `**${idx + 1}.** ${E.hammer} **ᴋɪᴄᴋᴇᴅ:** \`${entry.userTag}\` (<@${entry.userId}>) • ${time}${dmTag}\n` +
               `> ${E.chat} *"${entry.contentSnippet}"*`;
      } else {
        return `**${idx + 1}.** ${E.alert} **ꜰᴀɪʟᴇᴅ (ʜɪɢʜᴇʀ ᴘᴇʀᴍꜱ):** \`${entry.userTag}\` (<@${entry.userId}>) • ${time}${dmTag}\n` +
               `> ${E.shield} *${entry.failReason || 'Administrator / Role Hierarchy'}*\n` +
               `> ${E.chat} *"${entry.contentSnippet}"*`;
      }
    }).join('\n\n');
  }

  return buildV2Container({
    title: `# ${E.attacks} Dʀᴇᴀᴍ Nᴏᴅᴇs ┃ Hᴏɴᴇʏᴘᴏᴛ Sᴇᴄᴜʀɪᴛʏ Lᴏɢꜱ`,
    subtitle: `${E.security} Real-time intrusion detection and automatic softban sentinel.`,
    sections: [
      {
        title: `### ${E.stats} Intrusion Statistics`,
        body:
          `> ${E.arrowBlue} **Total Traps Triggered:** \`${totalAttempts}\`\n` +
          `> ${E.hammer} **Malicious Kicks / Softbans:** \`${totalKicks}\`\n` +
          `> ${E.shield} **Immune / Role Protected:** \`${immuneCount}\``
      },
      {
        title: `### ${E.rulesBook} Recent Incident History`,
        body: recentIncidents
      }
    ],
    footer: `-# ${E.security} Dream Nodes • Honeypot Sentinel Security`,
    accentColor: 0xFF3366,
    ephemeral: true
  });
}

module.exports = {
  buildV2Container,
  buildV2Alert,
  buildPingV2,
  buildStatusV2,
  buildPlansV2,
  buildTestWelcomeV2,
  buildHoneypotLogsV2
};
