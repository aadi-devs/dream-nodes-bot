require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { E, B } = require('../src/emojis');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once('clientReady', async () => {
  const channel = client.channels.cache.get('1574120437938520187') ||
    await client.channels.fetch('1574120437938520187').catch(() => null);

  if (!channel) return;

  const starString = Array(5).fill(E.star).join(' ');
  const now = Math.floor(Date.now() / 1000);
  const reviewId = '5e1d9d3f';

  const embed = new EmbedBuilder()
    .setAuthor({
      name: 'New Review! ❤️',
      iconURL: client.user.displayAvatarURL()
    })
    .setTitle('DreamNodes • verified customer review')
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(0x5865F2)
    .setDescription(
      `${starString} **5/5 - Premium Quality & Ultra-Fast Support!**\n\n` +
      'Amazing hosting service! The support team is very friendly, helpful, and quick to respond. Server setup was instant and ping is extraordinarily low. Highly recommended for any serious community or network!'
    )
    .addFields(
      { name: 'Rating', value: `${starString}(5/5)`, inline: true },
      { name: 'Reviewed', value: `<t:${now}:R>`, inline: true },
      { name: `${E.server} Service`, value: '`Intel Xeon E-2288G VPS`', inline: false }
    )
    .setFooter({
      text: `ReviewHub • Review ID: ${reviewId}`,
      iconURL: 'https://cdn.discordapp.com/emojis/1574105084130893889.gif'
    })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('review_submit_btn')
      .setLabel('Submit A Review')
      .setStyle(ButtonStyle.Primary)
      .setEmoji(B.rulesBook),
    new ButtonBuilder()
      .setCustomId(`review_useful_${reviewId}`)
      .setLabel('Useful (1)')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji(B.goldMedal)
  );

  const msg = await channel.send({ embeds: [embed], components: [row] });
  console.log('Sample review message sent! ID:', msg.id);

  const thread = await msg.startThread({
    name: "Owner's Response",
    autoArchiveDuration: 1440
  });

  await thread.send({
    content: `${E.crown} ${E.staff} **Owner Response from <@1188142147522805780>:**\n> Thank you so much for your valuable review and trust in Dream Nodes! We are thrilled to power your servers.`
  });

  console.log('Sample review thread created successfully!');
  client.destroy();
  process.exit(0);
});

client.login(process.env.DISCORD_TOKEN).catch(console.error);
