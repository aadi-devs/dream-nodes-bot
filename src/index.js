require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
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
  AttachmentBuilder
} = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID || '1573271779915337811';
const guildId = '1573272872737181696';
const welcomeChannelId = '1573337290502176848';

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

// Function to generate the welcome message payload
function buildWelcomeMessage(member) {
  const logoPath = path.join(__dirname, '..', 'assets', 'logo.jpg');
  const bannerPath = path.join(__dirname, '..', 'assets', 'welcome_banner_animated.gif');

  const logoAttachment = new AttachmentBuilder(logoPath, { name: 'logo.jpg' });
  const bannerAttachment = new AttachmentBuilder(bannerPath, { name: 'welcome_banner.gif' });

  const count = member.guild?.memberCount || 2;
  const username = member.user?.tag || member.user?.username || 'member';

  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${username}`,
      iconURL: member.user?.displayAvatarURL({ dynamic: true }) || client.user.displayAvatarURL()
    })
    .setTitle('✦ ε 🕊 ・ ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ᴅʀᴇᴀᴍ ɴᴏᴅᴇꜱ !')
    .setColor([55, 55, 61])
    .setDescription(
      `🧦 ・ ꜱᴀʏ ʜɪ ɪɴ <#1573281610210611266> ˚ ˖ ! ୨୧\n` +
      `→ ・ ✩ ・ ʀᴇᴀᴅ ᴛʜᴇ <#1573337303538208778> !\n` +
      `: 🧷 ‹3 ・ ꜱᴇʀᴠᴇʀ ᴜᴘᴅᴀᴛᴇꜱ ɪɴ <#1573337308529434756> ୨୧ ! ˚\n` +
      `・ ✧ ・ ᴇxᴘʟᴏʀᴇ ʜᴏꜱᴛɪɴɢ ɪɴ <#1573281486822445128> ୨୧ !`
    )
    .setThumbnail('attachment://logo.jpg')
    .setImage('attachment://welcome_banner.gif')
    .setFooter({ text: `ᴡᴇ ɴᴏᴡ ʜᴀᴠᴇ ${count} ᴍᴇᴍʙᴇʀꜱ! <3` });

  return {
    content: `<@${member.id}>`,
    embeds: [embed],
    files: [logoAttachment, bannerAttachment]
  };
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
    const channel = member.guild.channels.cache.get(welcomeChannelId) ||
                    member.guild.channels.cache.find(c => c.name.includes('welcome'));

    if (channel) {
      const payload = buildWelcomeMessage(member);
      await channel.send(payload);
      console.log(`[WELCOME SENT] Sent welcome embed for ${member.user.tag} in #${channel.name}`);
    } else {
      console.warn(`[WELCOME WARN] Welcome channel (${welcomeChannelId}) not found.`);
    }
  } catch (err) {
    console.error(`[WELCOME ERROR] Failed to send welcome message:`, err);
  }
});

// Handle Interactions
client.on('interactionCreate', async interaction => {
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
    const payload = buildWelcomeMessage(interaction.member);
    await targetChannel.send(payload);
    await interaction.reply({
      content: `✓ Sent preview welcome message to <#${targetChannel.id}>!`,
      ephemeral: true
    });
  }
});

client.login(token);
