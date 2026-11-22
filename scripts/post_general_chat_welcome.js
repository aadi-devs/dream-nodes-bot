require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { E, B } = require('../src/emojis');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once('clientReady', async () => {
  const channel = client.channels.cache.get('1574120435828662512') ||
    await client.channels.fetch('1574120435828662512').catch(() => null);

  if (!channel) {
    console.error('General channel not found');
    client.destroy();
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle('✦ DREAM NODES ┃ Community Lounge')
    .setColor(0x00F0FF)
    .setDescription(
      `# ${E.chat} **Welcome to the Dream Nodes Community Lounge!**\n` +
      `> ${E.sparkles} This is our central hub for general discussions, gaming, tech talk, server setups, and hanging out with fellow server owners and developers.\n\n` +
      `### ${E.rulesBook} **Community Guidelines:**\n` +
      `> ${E.arrowBlue} **Friendly & Respectful:** Treat everyone with kindness and respect.\n` +
      `> ${E.arrowBlue} **No Unsolicited Advertising:** Please do not DM members or post external server ads.\n` +
      `> ${E.arrowBlue} **Need Official Assistance?** Open a ticket in <#1573281601775870043> for 24/7 client support.\n` +
      `> ${E.arrowBlue} **Client Reviews:** Share your feedback with us in <#1574120437938520187>!\n\n` +
      `Say hello and let us know what projects you are building!`
    )
    .setImage('https://cdn.discordapp.com/attachments/1573281486822445128/1573688254144708709/Gemini_Generated_Image_l610mrl610mrl610_1.jpeg?ex=6922fd18&is=6921ab98&hm=74ff15175510f22fa2ffbe45bf69363539fb0421da7d526ea02e86bf4e8c56fa&')
    .setFooter({ text: 'Dream Nodes • developing solutions' })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('Client Panel')
      .setStyle(ButtonStyle.Link)
      .setURL('https://panel.dreamnodes.cloud')
      .setEmoji(B.hostinger),
    new ButtonBuilder()
      .setLabel('Support Desk')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.com/channels/1573272872737181696/1573281601775870043')
      .setEmoji(B.ticket),
    new ButtonBuilder()
      .setLabel('Customer Reviews')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.com/channels/1573272872737181696/1574120437938520187')
      .setEmoji(B.star)
  );

  const msg = await channel.send({ embeds: [embed], components: [row] });
  await msg.pin().catch(() => null);
  console.log('Posted and pinned general chat welcome message! ID:', msg.id);
  client.destroy();
  process.exit(0);
});

client.login(process.env.DISCORD_TOKEN).catch(console.error);
