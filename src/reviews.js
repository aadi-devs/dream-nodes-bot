const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle 
} = require('discord.js');
const { E, B } = require('./emojis');
const { buildV2Container, buildV2Alert } = require('./v2Containers');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const reviewsFile = path.join(dataDir, 'reviews.json');

const REVIEWS_CHANNEL_ID = '1574120437938520187'; // # ✦・ʀᴇᴠɪᴇᴡꜱ
const GENERAL_CHANNEL_ID = '1574120435828662512'; // # ✦・ɢᴇɴᴇʀᴀʟ-ᴄʜᴀᴛ
const FOUNDER_ROLE_ID = '1573412727383392427'; // ⋆｡°✩ ϝσυɳԃҽɾ ✩°｡⋆
const PAID_CLIENT_ROLE_ID = '1573412778620747886'; // ⋆｡°✩ ƈʅιҽɳƚ ✩°｡⋆

function isPaidClient(member) {
  if (!member) return false;
  // Administrators and Founders can always submit and verify
  if (member.permissions?.has('Administrator')) return true;
  if (member.roles?.cache) {
    if (member.roles.cache.has(PAID_CLIENT_ROLE_ID)) return true;
    return member.roles.cache.some(r => 
      r.name.toLowerCase().includes('client') ||
      r.name.includes('ƈʅιҽɳƚ') ||
      r.name.toLowerCase().includes('paid')
    );
  }
  return false;
}

function loadReviewsData() {
  try {
    if (fs.existsSync(reviewsFile)) {
      return JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
    }
  } catch (err) {
    console.error('[REVIEWS DATA READ ERROR]', err);
  }
  return { promptMessageId: null, reviews: [] };
}

function saveReviewsData(data) {
  try {
    fs.writeFileSync(reviewsFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[REVIEWS DATA WRITE ERROR]', err);
  }
}

/**
 * Generate formatted star string from a rating 1-5
 */
function getStarDisplay(rating) {
  const count = Math.max(1, Math.min(5, Math.round(rating)));
  return Array(count).fill(E.star).join(' ');
}

/**
 * Build the review modal popup
 */
function buildReviewModal() {
  const modal = new ModalBuilder()
    .setCustomId('modal_review_submit')
    .setTitle('Submit A Review');

  const ratingInput = new TextInputBuilder()
    .setCustomId('review_rating')
    .setLabel('Rating (1 to 5 Stars)')
    .setPlaceholder('5 (Enter 1, 2, 3, 4, or 5)')
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(1)
    .setRequired(true);

  const headlineInput = new TextInputBuilder()
    .setCustomId('review_headline')
    .setLabel('Review Headline / Summary')
    .setPlaceholder('e.g. Excellent Support! Fast & Reliable')
    .setStyle(TextInputStyle.Short)
    .setMinLength(3)
    .setMaxLength(100)
    .setRequired(true);

  const serviceInput = new TextInputBuilder()
    .setCustomId('review_service')
    .setLabel('Service Purchased (Optional)')
    .setPlaceholder('e.g. Budget MC 4GB, Intel VPS, Bot Hosting, Domain')
    .setStyle(TextInputStyle.Short)
    .setMaxLength(60)
    .setRequired(false);

  const commentInput = new TextInputBuilder()
    .setCustomId('review_comment')
    .setLabel('Your Review & Experience')
    .setPlaceholder('Describe your experience with Dream Nodes performance, uptime, staff, and pricing...')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(10)
    .setMaxLength(1000)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder().addComponents(ratingInput),
    new ActionRowBuilder().addComponents(headlineInput),
    new ActionRowBuilder().addComponents(serviceInput),
    new ActionRowBuilder().addComponents(commentInput)
  );

  return modal;
}

/**
 * Build the action row for a review message
 */
function buildReviewActionRow(reviewId, usefulCount = 0) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('review_submit_btn')
      .setLabel('Submit A Review')
      .setStyle(ButtonStyle.Primary)
      .setEmoji(B.rulesBook),
    new ButtonBuilder()
      .setCustomId(`review_useful_${reviewId}`)
      .setLabel(`Useful (${usefulCount})`)
      .setStyle(ButtonStyle.Secondary)
      .setEmoji(B.goldMedal)
  );
}

/**
 * Ensure persistent Review Hub prompt message exists in the review channel using Components V2
 */
async function postOrUpdateReviewHubPrompt(client) {
  try {
    const channel = client.channels.cache.get(REVIEWS_CHANNEL_ID) ||
      await client.channels.fetch(REVIEWS_CHANNEL_ID).catch(() => null);
    if (!channel) return;

    const data = loadReviewsData();
    const totalReviews = data.reviews.length;
    const avgRating = totalReviews === 0 ? '5.0' :
      (data.reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalReviews).toFixed(1);

    const v2Container = {
      flags: 32768, // IS_COMPONENTS_V2
      embeds: [],
      components: [
        {
          type: 17, // Borderless Container
          components: [
            {
              type: 10,
              content:
                `# ${E.stars} **DREAM NODES ┃ Verified Client Reviews**\n` +
                `### ${E.starRotating} Official Customer Feedback & Testimonials Desk\n\n` +
                `> ${E.diamond} We take immense pride in delivering enterprise cloud compute, high-frequency Minecraft nodes, VPS, and bot hosting. Genuine client reviews help us continuously improve and innovate!`
            },
            {
              type: 14,
              divider: true,
              spacing: 1
            },
            {
              type: 10,
              content:
                `### ${E.updates} **Review Desk Highlights:**\n` +
                `> ${E.star} **Average Community Rating:** \`${avgRating} / 5.0\` (${getStarDisplay(Math.round(Number(avgRating)))})\n` +
                `> ${E.membership} **Verified Client Reviews:** \`${totalReviews}\` live testimonials from server owners\n` +
                `> ${E.shield} **Verified Client Protection:** Submitting reviews & voting is strictly reserved for **Paid Clients** (<@&${PAID_CLIENT_ROLE_ID}>)\n\n` +
                `### ${E.gift} **How To Submit A Review:**\n` +
                `> ${E.arrowBlue} Verified clients can click **Submit A Review** below or type \`/review\`.\n` +
                `> ${E.arrowBlue} Founders & Management respond directly to every client review in the attached **Owner's Response** thread!`
            },
            {
              type: 14,
              divider: true,
              spacing: 1
            },
            {
              type: 1, // Action Row
              components: [
                {
                  type: 2,
                  style: 1, // Primary / Blurple
                  label: 'Submit A Review',
                  custom_id: 'review_submit_btn',
                  emoji: B.rulesBook
                },
                {
                  type: 2,
                  style: 5, // Link
                  label: 'Client Panel',
                  url: 'https://panel.dreamnodes.cloud',
                  emoji: B.hostinger
                },
                {
                  type: 2,
                  style: 5, // Link
                  label: 'Support Desk',
                  url: 'https://discord.com/channels/1573272872737181696/1573281601775870043',
                  emoji: B.ticket
                }
              ]
            },
            {
              type: 10,
              content: `-# ${E.starRotating} Dream Nodes • Verified Customer Reputation Hub`
            }
          ]
        }
      ]
    };

    const token = process.env.DISCORD_TOKEN || client.token;
    const promptMsgId = data.promptMessageId || '1574121350958948363';

    const res = await fetch(`https://discord.com/api/v10/channels/${REVIEWS_CHANNEL_ID}/messages/${promptMsgId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(v2Container)
    });

    if (res.ok) {
      data.promptMessageId = promptMsgId;
      saveReviewsData(data);
    } else {
      const postRes = await fetch(`https://discord.com/api/v10/channels/${REVIEWS_CHANNEL_ID}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bot ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(v2Container)
      });
      const postData = await postRes.json();
      if (postRes.ok) {
        data.promptMessageId = postData.id;
        saveReviewsData(data);
        await channel.messages.fetch(postData.id).then(m => m.pin()).catch(() => null);
      }
    }
  } catch (err) {
    console.error('[REVIEW PROMPT ERROR]', err);
  }
}

/**
 * Build Components V2 alert for paid clients only
 */
function buildClientRequiredV2() {
  return buildV2Container({
    title: `# ${E.stopSign} Verified Paid Clients Only`,
    subtitle: `${E.security} Customer reviews and feedback interactions are reserved for verified **Paid Clients** (<@&${PAID_CLIENT_ROLE_ID}>).`,
    description:
      `> ${E.ticket} **Need your client role?** If you have purchased a hosting plan or VPS with Dream Nodes, please open a support ticket in <#1573281601775870043> to receive your verified client role!\n` +
      `> ${E.sparkles} Once assigned, you will unlock review submissions, feature upvoting, and client channels.`,
    buttons: [
      {
        label: 'Open Support Ticket',
        url: 'https://discord.com/channels/1573272872737181696/1573281601775870043',
        emoji: B.ticket
      }
    ],
    footer: `-# ${E.security} Dream Nodes • Client Verification Hub`,
    accentColor: 0xFF3366,
    ephemeral: true
  });
}

/**
 * Handle "Submit A Review" button click
 */
async function handleReviewSubmitBtn(interaction) {
  if (!isPaidClient(interaction.member)) {
    return interaction.reply(buildClientRequiredV2());
  }

  const modal = buildReviewModal();
  await interaction.showModal(modal);
}

/**
 * Handle Review Modal Submission
 */
async function handleReviewModalSubmit(interaction) {
  if (!isPaidClient(interaction.member)) {
    return interaction.reply(buildClientRequiredV2());
  }

  const rawRating = interaction.fields.getTextInputValue('review_rating');
  let rating = parseInt(rawRating.trim(), 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    rating = 5;
  }

  const headline = interaction.fields.getTextInputValue('review_headline').trim();
  const service = (interaction.fields.getTextInputValue('review_service') || '').trim();
  const comment = interaction.fields.getTextInputValue('review_comment').trim();

  const reviewId = crypto.randomBytes(4).toString('hex'); // e.g. "5e1d9d3f"
  const starString = getStarDisplay(rating);
  const now = Math.floor(Date.now() / 1000);

  const channel = interaction.client.channels.cache.get(REVIEWS_CHANNEL_ID) ||
    await interaction.client.channels.fetch(REVIEWS_CHANNEL_ID).catch(() => null);

  if (!channel) {
    return interaction.reply(buildV2Alert({
      title: 'Channel Error',
      message: 'Review channel not found. Please contact administration.',
      type: 'error',
      ephemeral: true
    }));
  }

  const userAvatar = interaction.user.displayAvatarURL({ dynamic: true, size: 256 });

  // Build aesthetic embed matching the requested ReviewHub layout
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `New Customer Review`,
      iconURL: userAvatar
    })
    .setTitle(`${interaction.user.tag} • new review`)
    .setThumbnail(userAvatar)
    .setColor(0x5865F2)
    .setDescription(
      `${starString} **${rating}/5 - ${headline}**\n\n` +
      `${comment}`
    )
    .addFields(
      {
        name: 'Rating',
        value: `${starString}(${rating}/5)`,
        inline: true
      },
      {
        name: 'Reviewed',
        value: `<t:${now}:R>`,
        inline: true
      }
    )
    .setFooter({
      text: `ReviewHub • Review ID: ${reviewId}`,
      iconURL: 'https://cdn.discordapp.com/emojis/1574105084130893889.gif'
    })
    .setTimestamp();

  if (service) {
    embed.addFields({
      name: `${E.server} Service`,
      value: `\`${service}\``,
      inline: false
    });
  }

  const row = buildReviewActionRow(reviewId, 0);

  // Send review message to review channel
  const reviewMessage = await channel.send({
    embeds: [embed],
    components: [row]
  });

  // Create Discord Thread for Owner's Response
  let threadId = null;
  try {
    const thread = await reviewMessage.startThread({
      name: "Owner's Response",
      autoArchiveDuration: 1440
    });
    threadId = thread.id;

    const threadWelcome = buildV2Container({
      title: `### ${E.crown} Owner's Response Thread`,
      subtitle: `${E.staff} Official feedback channel for Founders & Management`,
      description:
        `> ${E.sparkles} Thank you <@${interaction.user.id}> for your valuable review!\n` +
        `> ${E.arrowBlue} Founders & Management (<@&${FOUNDER_ROLE_ID}>) will reply to your feedback here.`,
      footer: `-# ${E.verifiedBlue} Dream Nodes • Customer Relations`,
      accentColor: 0xFFAA00,
      ephemeral: false
    });
    await thread.send({ flags: threadWelcome.flags, components: threadWelcome.components });
  } catch (threadErr) {
    console.error('[REVIEW THREAD CREATE ERROR]', threadErr);
  }

  // Save review in persistent storage
  const data = loadReviewsData();
  data.reviews.push({
    id: reviewId,
    messageId: reviewMessage.id,
    channelId: channel.id,
    threadId,
    userId: interaction.user.id,
    userTag: interaction.user.tag,
    rating,
    headline,
    service,
    comment,
    timestamp: now,
    usefulVotes: []
  });
  saveReviewsData(data);

  // Update prompt stats if needed
  await postOrUpdateReviewHubPrompt(interaction.client).catch(() => null);

  await interaction.reply(buildV2Alert({
    title: 'Review Published',
    message: `Thank you for your valuable feedback! Your customer review has been published in <#${REVIEWS_CHANNEL_ID}>!`,
    type: 'success',
    ephemeral: true
  }));
}

/**
 * Handle clicking "Useful (N)" button
 */
async function handleReviewUsefulBtn(interaction) {
  if (!isPaidClient(interaction.member)) {
    return interaction.reply(buildClientRequiredV2());
  }

  const customId = interaction.customId;
  const reviewId = customId.replace('review_useful_', '');

  const data = loadReviewsData();
  const review = data.reviews.find(r => r.id === reviewId);

  if (!review) {
    return interaction.reply(buildV2Alert({
      title: 'Review Not Found',
      message: 'Review record could not be found.',
      type: 'error',
      ephemeral: true
    }));
  }

  if (review.userId === interaction.user.id) {
    return interaction.reply(buildV2Alert({
      title: 'Action Prohibited',
      message: 'You cannot mark your own review as useful!',
      type: 'warning',
      ephemeral: true
    }));
  }

  review.usefulVotes = review.usefulVotes || [];
  const alreadyVoted = review.usefulVotes.includes(interaction.user.id);

  if (alreadyVoted) {
    review.usefulVotes = review.usefulVotes.filter(id => id !== interaction.user.id);
  } else {
    review.usefulVotes.push(interaction.user.id);
  }
  saveReviewsData(data);

  const updatedRow = buildReviewActionRow(reviewId, review.usefulVotes.length);

  try {
    await interaction.update({ components: [updatedRow] });
  } catch (err) {
    console.error('[USEFUL UPDATE ERROR]', err);
  }

  await interaction.followUp(buildV2Alert({
    title: alreadyVoted ? 'Vote Removed' : 'Vote Registered',
    message: alreadyVoted ?
      `Removed your useful vote for review **#${reviewId}**.` :
      `Marked review **#${reviewId}** as useful! (${review.usefulVotes.length} total votes recorded)`,
    type: alreadyVoted ? 'info' : 'success',
    ephemeral: true
  })).catch(() => null);
}

/**
 * Handle /review slash command
 */
async function handleReviewSlashCommand(interaction) {
  if (!isPaidClient(interaction.member)) {
    return interaction.reply(buildClientRequiredV2());
  }

  const modal = buildReviewModal();
  await interaction.showModal(modal);
}

/**
 * Handle /respond slash command for owner/staff to respond to a review
 */
async function handleReviewRespondSlashCommand(interaction) {
  const reviewId = interaction.options.getString('review_id');
  const responseText = interaction.options.getString('response');

  const data = loadReviewsData();
  const review = data.reviews.find(r => r.id.toLowerCase() === reviewId.toLowerCase());

  if (!review) {
    return interaction.reply(buildV2Alert({
      title: 'Review Not Found',
      message: `Could not find review with ID \`${reviewId}\`.`,
      type: 'error',
      ephemeral: true
    }));
  }

  if (!review.threadId) {
    return interaction.reply(buildV2Alert({
      title: 'Thread Unavailable',
      message: 'This review does not have an active Owner\'s Response thread.',
      type: 'error',
      ephemeral: true
    }));
  }

  try {
    const thread = interaction.client.channels.cache.get(review.threadId) ||
      await interaction.client.channels.fetch(review.threadId).catch(() => null);

    if (!thread) {
      return interaction.reply(buildV2Alert({
        title: 'Thread Unreachable',
        message: `Could not access the discussion thread for review \`${reviewId}\`.`,
        type: 'error',
        ephemeral: true
      }));
    }

    const ownerResponsePayload = buildV2Container({
      title: `### ${E.crown} Official Owner Response`,
      subtitle: `${E.staff} Response from Executive Staff (<@${interaction.user.id}>)`,
      description: `> ${responseText}`,
      footer: `-# ${E.verifiedBlue} Dream Nodes • Executive Client Relations`,
      accentColor: 0xFFAA00,
      ephemeral: false
    });

    await thread.send({ flags: ownerResponsePayload.flags, components: ownerResponsePayload.components });

    await interaction.reply(buildV2Alert({
      title: 'Response Dispatched',
      message: `Successfully posted official response to review **#${reviewId}** in the thread!`,
      type: 'success',
      ephemeral: true
    }));
  } catch (err) {
    console.error('[REVIEW RESPOND ERROR]', err);
    await interaction.reply(buildV2Alert({
      title: 'Response Error',
      message: `Failed to post response: \`${err.message}\``,
      type: 'error',
      ephemeral: true
    }));
  }
}

module.exports = {
  REVIEWS_CHANNEL_ID,
  GENERAL_CHANNEL_ID,
  postOrUpdateReviewHubPrompt,
  handleReviewSubmitBtn,
  handleReviewModalSubmit,
  handleReviewUsefulBtn,
  handleReviewSlashCommand,
  handleReviewRespondSlashCommand
};
