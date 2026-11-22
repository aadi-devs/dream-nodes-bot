const { E, B } = require('./emojis');

/**
 * Build a Discord Components V2 payload (type: 17 borderless container)
 */
function buildV2Container({
  title,
  subtitle,
  description,
  sections = [],
  buttons = [],
  footer,
  accentColor = null,
  ephemeral = false
}) {
  const components = [];

  // Header section
  let headerContent = '';
  if (title) headerContent += `${title}\n`;
  if (subtitle) headerContent += `> ${subtitle}\n`;
  if (description) headerContent += `\n${description}`;

  if (headerContent.trim()) {
    components.push({
      type: 10, // Text Display
      content: headerContent.trim()
    });
  }

  // Body sections separated by dividers
  if (sections && sections.length > 0) {
    for (const sec of sections) {
      if (components.length > 0) {
        components.push({
          type: 14, // Divider
          divider: true,
          spacing: 1
        });
      }

      let secContent = '';
      if (typeof sec === 'string') {
        secContent = sec;
      } else {
        if (sec.title) secContent += `${sec.title}\n`;
        if (sec.body) secContent += `${sec.body}`;
      }

      components.push({
        type: 10, // Text Display
        content: secContent.trim()
      });
    }
  }

  // Action Row / Buttons
  if (buttons && buttons.length > 0) {
    components.push({
      type: 14, // Divider
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

  // Footer subtext
  if (footer) {
    components.push({
      type: 10,
      content: footer.startsWith('-#') ? footer : `-# ${footer}`
    });
  }

  const container = {
    type: 17, // Borderless Container
    components
  };

  if (accentColor !== null && accentColor !== undefined) {
    container.accent_color = accentColor;
  }

  return {
    flags: ephemeral ? 32832 : 32768, // 32768 = IS_COMPONENTS_V2 | 64 = EPHEMERAL
    embeds: [],
    components: [container]
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
  let defaultFooter = `-# ${E.sparkles} Dʀᴇᴀᴍ Nᴏᴅᴇs • Cloud Systems`;

  if (type === 'success') {
    icon = E.tick5;
    defaultFooter = `-# ${E.verifiedBlue} Dʀᴇᴀᴍ Nᴏᴅᴇs • Verified Operation`;
  } else if (type === 'error') {
    icon = E.cross;
    defaultFooter = `-# ${E.security} Dʀᴇᴀᴍ Nᴏᴅᴇs • Sentinel Security`;
  } else if (type === 'warning') {
    icon = E.alert;
    defaultFooter = `-# ${E.security} Dʀᴇᴀᴍ Nᴏᴅᴇs • Access Enforcement`;
  }

  const finalTitle = title ? (title.includes('<a:') ? title : `### ${icon} **${title}**`) : '';
  const finalDescription = message ? (message.startsWith('>') ? message : `> ${message}`) : '';

  return buildV2Container({
    title: finalTitle,
    description: finalDescription,
    buttons,
    footer: footer || defaultFooter,
    ephemeral
  });
}

/**
 * /ping Slash Command V2 Container (Borderless)
 */
function buildPingV2(wsPing, uptimeHours) {
  return buildV2Container({
    title: `# ${E.ping} **DREAM NODES ┃ Network & Gateway Telemetry**`,
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
    footer: `-# ${E.verifiedBlue} Dream Nodes • Operational Telemetry Synchronized`,
    ephemeral: true
  });
}

/**
 * /status Slash Command V2 Container (Borderless)
 */
function buildStatusV2({ wsPing, uptimeHours, memUsage }) {
  return buildV2Container({
    title: `# ${E.stats} **DREAM NODES ┃ Infrastructure Status**`,
    subtitle: `${E.sparkles} Real-time operational telemetry for Dream Nodes hosting systems.`,
    sections: [
      {
        title: `### ${E.greenDot} **Core Fleet Health**`,
        body:
          `> ${E.tick5} **Fleet Status:** \`ALL OPERATIONAL (100%)\`\n` +
          `> ${E.lightning} **Gateway Ping:** \`${wsPing}ms\`\n` +
          `> ${E.clock} **Bot Uptime:** \`${uptimeHours}h\`\n` +
          `> ${E.gear} **Memory Heap:** \`${memUsage} MB\``
      },
      {
        title: `### ${E.server} **Global Compute Clusters**`,
        body:
          `> ${E.arrowBlue} **Node-US-East (Virginia):** \`Operational • 20.0 TPS\`\n` +
          `> ${E.arrowBlue} **Node-EU-Central (Frankfurt):** \`Operational • 20.0 TPS\`\n` +
          `> ${E.arrowBlue} **Node-SG-Asia (Singapore):** \`Operational • 20.0 TPS\``
      },
      {
        title: `### ${E.shield} **Enterprise Network Protection**`,
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
    footer: `-# ${E.verifiedBlue} Dream Nodes • developing solutions`,
    ephemeral: false
  });
}

/**
 * /plans Slash Command V2 Container (Borderless)
 */
function buildPlansV2() {
  return buildV2Container({
    title: `# ${E.clouds} **DREAM NODES ┃ Hosting Plans & Services**`,
    subtitle: `${E.sparkles} High-performance game servers, enterprise VPS, and tailored cloud compute.`,
    sections: [
      {
        title: `### ${E.minecraft} **Minecraft Game Server Hosting**`,
        body:
          `> ${E.arrowBlue} **Compute:** Intel Xeon & AMD Ryzen 9 high-frequency performance cores.\n` +
          `> ${E.arrowBlue} **Storage & Protection:** Unmetered Gen4 NVMe arrays, daily backups & L7 DDoS filters.\n` +
          `> ${E.arrowBlue} **Configurations:** Browse node plans & order in <#1573281486822445128>.`
      },
      {
        title: `### ${E.vps} **Cloud Virtual Private Servers (VPS / VDS)**`,
        body:
          `> ${E.arrowBlue} **Compute:** Dedicated AMD EPYC & Intel Xeon virtualization with full Root / SSH access.\n` +
          `> ${E.arrowBlue} **Transit:** Tier-1 multi-homed 10Gbps uplinks in US, Germany & Singapore.\n` +
          `> ${E.arrowBlue} **Configurations:** Browse VPS specifications in <#1573281509140336816>.`
      },
      {
        title: `### ${E.ticket} **Bespoke Custom Deployments**`,
        body:
          `> ${E.arrowBlue} **Enterprise:** Need private proxy routing, BGP transit, or dedicated game networks?\n` +
          `> ${E.arrowBlue} **Assistance:** Open a consultation ticket in <#1573281601775870043> to speak directly with Founders.`
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
    ephemeral: false
  });
}

/**
 * /testwelcome Slash Command V2 Container (Borderless)
 */
function buildTestWelcomeV2(channelId) {
  return buildV2Container({
    title: `### ${E.tick5} **Welcome Dispatch Preview Sent!**`,
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
    footer: `-# ${E.sparkles} Dream Nodes • Automated Onboarding Sentinel`,
    ephemeral: true
  });
}

/**
 * Honeypot Kicks Log V2 Container (Borderless)
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
    title: `# ${E.attacks} **DREAM NODES ┃ Honeypot Security Logs**`,
    subtitle: `${E.security} Real-time intrusion detection and automatic softban sentinel.`,
    sections: [
      {
        title: `### ${E.stats} **Intrusion Statistics**`,
        body:
          `> ${E.arrowBlue} **Total Traps Triggered:** \`${totalAttempts}\`\n` +
          `> ${E.hammer} **Malicious Kicks / Softbans:** \`${totalKicks}\`\n` +
          `> ${E.shield} **Immune / Role Protected:** \`${immuneCount}\``
      },
      {
        title: `### ${E.rulesBook} **Recent Incident History**`,
        body: recentIncidents
      }
    ],
    footer: `-# ${E.security} Dream Nodes • Honeypot Sentinel Security`,
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
