const { spawn } = require('child_process');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
  StreamType,
  getVoiceConnection,
  NoSubscriberBehavior
} = require('@discordjs/voice');
const { SlashCommandBuilder } = require('discord.js');
const yts = require('yt-search');
const { E, B } = require('./emojis');

// Guild music queues: Map<guildId, GuildQueue>
const queues = new Map();

class GuildQueue {
  constructor(guildId, textChannel, voiceChannel) {
    this.guildId = guildId;
    this.textChannel = textChannel;
    this.voiceChannel = voiceChannel;
    this.connection = null;
    this.player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause
      }
    });
    this.songs = []; // Array of Track objects
    this.currentSong = null;
    this.currentResource = null;
    this.volume = 100; // 0 - 150%
    this.loopMode = 'off'; // 'off' | 'track' | 'queue'
    this.autoplay = false; // Automatic song recommendation when queue finishes
    this.playedHistory = new Set(); // Track played URLs to avoid duplicate autoplay songs
    this.controlPanelMessage = null;
    this.activeProcesses = [];
    this.isPlaying = false;
    this.isPaused = false;
    this.disconnectTimer = null;

    // Attach audio player state listeners
    this.player.on(AudioPlayerStatus.Idle, () => {
      this.cleanActiveProcesses();
      this.handleSongFinish();
    });

    this.player.on('error', error => {
      console.error(`[MUSIC PLAYER ERROR in ${this.guildId}]:`, error.message);
      this.cleanActiveProcesses();
      if (this.textChannel) {
        this.textChannel.send({
          content: `-# ⚠️ Audio playback error encountered. Skipping to next track...`
        }).catch(() => {});
      }
      this.handleSongFinish();
    });
  }

  cleanActiveProcesses() {
    for (const p of this.activeProcesses) {
      try {
        p.kill();
      } catch (e) {}
    }
    this.activeProcesses = [];
  }

  async handleSongFinish() {
    this.isPlaying = false;
    this.isPaused = false;

    if (this.currentSong && this.currentSong.url) {
      this.playedHistory.add(this.currentSong.url);
    }

    if (this.loopMode === 'track' && this.currentSong) {
      // Re-play the same song
      this.playNext();
      return;
    }

    if (this.loopMode === 'queue' && this.currentSong) {
      // Push finished song to back of queue
      this.songs.push(this.currentSong);
    }

    if (this.songs.length > 0) {
      this.currentSong = this.songs.shift();
      this.playNext();
      return;
    }

    // Autoplay fallback when queue is empty
    if (this.autoplay && this.currentSong) {
      const previousSong = this.currentSong;
      if (this.textChannel) {
        this.textChannel.send({
          content: `-# 📻 **Autoplay:** Finding next recommended track for **${previousSong.title}**...`
        }).catch(() => {});
      }

      const autoTrack = await this.fetchAutoplayTrack(previousSong);
      if (autoTrack) {
        this.currentSong = autoTrack;
        this.playNext();
        return;
      }
    }

    this.currentSong = null;
    this.currentResource = null;
    if (this.controlPanelMessage) {
      this.controlPanelMessage.edit(buildQueueEndedPayload()).catch(() => {});
    }
    // Start 5-minute idle disconnect timer
    this.resetDisconnectTimer();
  }

  async fetchAutoplayTrack(previousSong) {
    if (!previousSong) return null;
    try {
      const queries = [];
      if (previousSong.author && previousSong.author !== 'Unknown Artist' && previousSong.author !== 'Direct URL') {
        queries.push(`${previousSong.author} official audio`);
        queries.push(`${previousSong.author} songs`);
      }
      queries.push(`${previousSong.title} mix`);
      queries.push(`${previousSong.title} similar`);

      for (const q of queries) {
        const res = await yts({ query: q });
        if (!res || !res.videos || res.videos.length === 0) continue;

        for (const v of res.videos) {
          if (this.playedHistory.has(v.url)) continue;
          if (previousSong.url === v.url) continue;
          if (v.seconds && (v.seconds < 45 || v.seconds > 600)) continue;

          this.playedHistory.add(v.url);
          return {
            title: v.title,
            url: v.url,
            duration: v.timestamp || 'N/A',
            seconds: v.seconds || 0,
            author: v.author?.name || 'YouTube Music',
            thumbnail: v.thumbnail || null,
            requestedBy: 'DreamNodes Autoplay',
            requestedById: 'autoplay'
          };
        }
      }
    } catch (err) {
      console.error('[AUTOPLAY FETCH ERROR]:', err);
    }
    return null;
  }

  resetDisconnectTimer() {
    if (this.disconnectTimer) clearTimeout(this.disconnectTimer);
    this.disconnectTimer = setTimeout(() => {
      if (!this.isPlaying && this.connection) {
        this.destroy();
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  clearDisconnectTimer() {
    if (this.disconnectTimer) {
      clearTimeout(this.disconnectTimer);
      this.disconnectTimer = null;
    }
  }

  async playNext() {
    if (!this.currentSong) return;
    if (this.currentSong.url) {
      this.playedHistory.add(this.currentSong.url);
    }
    this.clearDisconnectTimer();
    this.cleanActiveProcesses();

    try {
      const { resource, processes } = createAudioStream(this.currentSong.url);
      this.activeProcesses = processes;
      this.currentResource = resource;

      // Apply volume
      if (resource.volume) {
        resource.volume.setVolume(this.volume / 100);
      }

      this.player.play(resource);
      this.isPlaying = true;
      this.isPaused = false;

      // Send or update Control Panel
      await this.sendOrUpdateControlPanel();
    } catch (err) {
      console.error('[STREAM CREATION FAILED]:', err);
      if (this.textChannel) {
        this.textChannel.send({
          content: `-# ❌ Failed to stream: **${this.currentSong.title}**. Skipping...`
        }).catch(() => {});
      }
      this.handleSongFinish();
    }
  }

  async sendOrUpdateControlPanel() {
    if (!this.textChannel || !this.currentSong) return;

    const payload = buildControlPanelPayload(this);

    try {
      if (this.controlPanelMessage) {
        await this.controlPanelMessage.delete().catch(() => {});
      }
      this.controlPanelMessage = await this.textChannel.send(payload);
    } catch (err) {
      console.error('[SEND CONTROL PANEL ERROR]:', err);
    }
  }

  destroy() {
    this.clearDisconnectTimer();
    this.cleanActiveProcesses();
    try {
      this.player.stop();
    } catch (e) {}
    try {
      if (this.connection) this.connection.destroy();
    } catch (e) {}
    queues.delete(this.guildId);
  }
}

/**
 * Creates audio stream using yt-dlp piped to ffmpeg
 */
function createAudioStream(url) {
  // Spawn yt-dlp to output raw audio stream
  const ytdlp = spawn('yt-dlp', [
    '-f', 'bestaudio',
    '-o', '-',
    '--no-playlist',
    '--quiet',
    url
  ]);

  // Spawn ffmpeg to transcode into 48kHz 16-bit stereo raw PCM
  const ffmpeg = spawn('ffmpeg', [
    '-i', 'pipe:0',
    '-f', 's16le',
    '-ar', '48000',
    '-ac', '2',
    '-loglevel', 'warning',
    'pipe:1'
  ]);

  ytdlp.stdout.pipe(ffmpeg.stdin);

  ytdlp.on('error', err => console.error('[YT-DLP PROCESS ERROR]', err.message));
  ffmpeg.on('error', err => console.error('[FFMPEG PROCESS ERROR]', err.message));

  const resource = createAudioResource(ffmpeg.stdout, {
    inputType: StreamType.Raw,
    inlineVolume: true
  });

  return { resource, processes: [ytdlp, ffmpeg] };
}

/**
 * Fast search query resolver via yt-search
 */
async function resolveSong(query) {
  // If already full URL, search videoId or resolve directly
  if (query.startsWith('http://') || query.startsWith('https://')) {
    try {
      const res = await yts(query);
      if (res && res.videos && res.videos.length > 0) {
        const v = res.videos[0];
        return {
          title: v.title,
          url: v.url,
          duration: v.timestamp || 'N/A',
          seconds: v.seconds || 0,
          author: v.author?.name || 'Unknown Artist',
          thumbnail: v.thumbnail || null
        };
      }
    } catch (e) {}

    return {
      title: 'Web Audio Stream',
      url: query,
      duration: 'Live / Audio Stream',
      seconds: 0,
      author: 'Direct URL',
      thumbnail: null
    };
  }

  // Normal keyword search: pick #1 best match
  const searchRes = await yts(query);
  if (!searchRes || !searchRes.videos || searchRes.videos.length === 0) {
    return null;
  }

  const v = searchRes.videos[0];
  return {
    title: v.title,
    url: v.url,
    duration: v.timestamp || 'N/A',
    seconds: v.seconds || 0,
    author: v.author?.name || 'Unknown Artist',
    thumbnail: v.thumbnail || null
  };
}

/**
 * Real-time fast autocomplete suggestions
 */
async function getAutocompleteSuggestions(query) {
  if (!query || query.trim().length < 2) {
    return [
      { name: '🔥 Trending: Lofi Hip Hop Beats [24/7 Radio]', value: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
      { name: '🎵 Popular: Alan Walker - Faded [3:32]', value: 'https://www.youtube.com/watch?v=60ItHLz5WEA' },
      { name: '⚡ Popular: The Weeknd - Blinding Lights [3:20]', value: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ' }
    ];
  }

  try {
    const res = await yts(query.trim());
    if (!res || !res.videos) return [];
    return res.videos.slice(0, 15).map(v => ({
      name: `${v.title.slice(0, 80)} [${v.timestamp || 'Audio'}]`.slice(0, 100),
      value: v.url
    }));
  } catch (err) {
    return [];
  }
}

/**
 * Build the Components V2 Control Panel Message Payload
 */
function buildControlPanelPayload(queue) {
  const song = queue.currentSong;
  const statusEmoji = queue.isPaused ? '⏸️' : '🟢';
  const statusText = queue.isPaused ? 'PAUSED' : 'PLAYING';
  const loopTag = queue.loopMode === 'track' ? '🔂 Track' : (queue.loopMode === 'queue' ? '🔁 Queue' : 'OFF');
  const autoplayTag = queue.autoplay ? '🟢 ON' : '⚫ OFF';

  const content =
`# ${E.lightning} **NOW PLAYING** ${E.sparkles}

> 🎵 **[${song.title}](${song.url})**
> ${E.arrowBlue} **Artist / Channel:** \`${song.author}\`
> ⏱️ **Duration:** \`${song.duration}\` • 🎧 **Requested By:** <@${song.requestedById}>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> 🔊 **Volume:** \`${queue.volume}%\` • 🔁 **Loop:** \`${loopTag}\` • 📻 **Autoplay:** \`${autoplayTag}\`
> ${statusEmoji} **Status:** \`${statusText}\` • 📜 **Queue:** \`${queue.songs.length} song(s) remaining\`

-# ${E.verifiedBlue} Dream Nodes Hi-Fi Audio Engine • 48kHz Stereo`;

  return {
    flags: 32768, // IS_COMPONENTS_V2
    components: [
      {
        type: 17, // Borderless Container
        accent_color: null,
        components: [
          {
            type: 10,
            content: content
          },
          {
            type: 14,
            divider: true,
            spacing: 1
          },
          {
            type: 1, // Action Row 1: Playback Controls
            components: [
              {
                type: 2,
                style: queue.isPaused ? 3 : 2, // Green when paused, grey when playing
                label: queue.isPaused ? 'Resume' : 'Pause',
                emoji: { name: queue.isPaused ? '▶️' : '⏸️' },
                custom_id: 'music_pause_resume'
              },
              {
                type: 2,
                style: 2,
                label: 'Skip',
                emoji: { name: '⏭️' },
                custom_id: 'music_skip'
              },
              {
                type: 2,
                style: 4, // Red
                label: 'Stop',
                emoji: { name: '⏹️' },
                custom_id: 'music_stop'
              },
              {
                type: 2,
                style: queue.loopMode !== 'off' ? 1 : 2,
                label: `Loop (${loopTag})`,
                emoji: { name: '🔁' },
                custom_id: 'music_loop'
              },
              {
                type: 2,
                style: 2,
                label: 'Queue',
                emoji: { name: '📜' },
                custom_id: 'music_queue'
              }
            ]
          },
          {
            type: 1, // Action Row 2: Audio & Queue Tools
            components: [
              {
                type: 2,
                style: 2,
                label: 'Vol -',
                emoji: { name: '🔉' },
                custom_id: 'music_vol_down'
              },
              {
                type: 2,
                style: 2,
                label: 'Vol +',
                emoji: { name: '🔊' },
                custom_id: 'music_vol_up'
              },
              {
                type: 2,
                style: 2,
                label: 'Shuffle',
                emoji: { name: '🔀' },
                custom_id: 'music_shuffle'
              },
              {
                type: 2,
                style: queue.autoplay ? 3 : 2,
                label: queue.autoplay ? 'Autoplay: ON' : 'Autoplay: OFF',
                emoji: { name: '📻' },
                custom_id: 'music_autoplay'
              },
              {
                type: 2,
                style: 2,
                label: 'Disconnect',
                emoji: { name: '❌' },
                custom_id: 'music_disconnect'
              }
            ]
          }
        ]
      }
    ]
  };
}

/**
 * Payload when queue ends
 */
function buildQueueEndedPayload() {
  return {
    flags: 32768,
    components: [
      {
        type: 17,
        accent_color: null,
        components: [
          {
            type: 10,
            content: `# ${E.stats} **PLAYBACK FINISHED** ${E.sparkles}\n\n` +
                     `> ${E.tick5} **Queue is empty!** All queued songs have finished playing.\n` +
                     `> ${E.arrowBlue} Use \`/play <name>\` anytime to play another track!`
          },
          {
            type: 10,
            content: `-# ${E.verifiedBlue} Dream Nodes Hi-Fi Audio Engine`
          }
        ]
      }
    ]
  };
}

/**
 * Slash Commands Definition for Music
 */
const musicCommands = [
  new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song or add it to queue in your voice channel')
    .addStringOption(option =>
      option
        .setName('song')
        .setDescription('Song title, artist, or YouTube/SoundCloud URL (type to see instant suggestions)')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause current music playback'),

  new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume paused music playback'),

  new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the currently playing song'),

  new SlashCommandBuilder()
    .setName('skipto')
    .setDescription('Skip directly to a specific track number in the queue')
    .addIntegerOption(option =>
      option
        .setName('position')
        .setDescription('The queue position number to skip to (e.g. 2, 3)')
        .setRequired(true)
        .setMinValue(1)
    ),

  new SlashCommandBuilder()
    .setName('queue')
    .setDescription('View the current song and upcoming queue list'),

  new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Show the live control panel for the currently playing track'),

  new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop music playback, clear queue, and leave voice channel'),

  new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Adjust the playback volume (1% - 150%)')
    .addIntegerOption(option =>
      option
        .setName('level')
        .setDescription('Volume level between 1 and 150')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(150)
    ),

  new SlashCommandBuilder()
    .setName('join')
    .setDescription('Invite the bot to join your current voice channel'),

  new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Disconnect the bot from the voice channel'),

  new SlashCommandBuilder()
    .setName('autoplay')
    .setDescription('Toggle automatic playback of recommended songs when the queue ends')
    .addBooleanOption(option =>
      option
        .setName('enabled')
        .setDescription('Enable or disable autoplay mode (true/false)')
        .setRequired(false)
    )
];

/**
 * Handle Autocomplete for /play
 */
async function handleMusicAutocomplete(interaction) {
  try {
    const focused = interaction.options.getFocused();
    const suggestions = await getAutocompleteSuggestions(focused);
    await interaction.respond(suggestions);
  } catch (err) {
    try {
      await interaction.respond([]);
    } catch (e) {}
  }
}

/**
 * Handle Music Slash Commands
 */
async function handleMusicCommand(interaction) {
  const { commandName, guildId, member, channel } = interaction;
  const voiceChannel = member?.voice?.channel;

  // Join command
  if (commandName === 'join') {
    if (!voiceChannel) {
      return interaction.reply({
        flags: 32832,
        components: [
          {
            type: 17,
            components: [
              { type: 10, content: `### ${E.alert} **Voice Channel Required**\n> Please join a voice channel first before using \`/join\`!` }
            ]
          }
        ]
      });
    }

    let queue = queues.get(guildId);
    if (!queue) {
      queue = new GuildQueue(guildId, channel, voiceChannel);
      queues.set(guildId, queue);
    }

    try {
      queue.connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator
      });
      queue.connection.subscribe(queue.player);
      await entersState(queue.connection, VoiceConnectionStatus.Ready, 15_000);

      return interaction.reply({
        flags: 32768,
        components: [
          {
            type: 17,
            components: [
              {
                type: 10,
                content: `### ${E.tick5} **Connected to Voice Channel**\n> Successfully joined **${voiceChannel.name}**! Use \`/play <song>\` to start streaming music.`
              }
            ]
          }
        ]
      });
    } catch (err) {
      console.error('[VOICE JOIN ERROR]:', err);
      return interaction.reply({
        content: `❌ Could not connect to **${voiceChannel.name}**: ${err.message}`,
        ephemeral: true
      });
    }
  }

  // Play command
  if (commandName === 'play') {
    if (!voiceChannel) {
      return interaction.reply({
        flags: 32832,
        components: [
          {
            type: 17,
            components: [
              { type: 10, content: `### ${E.alert} **Voice Channel Required**\n> You must be in a voice channel to play music!` }
            ]
          }
        ]
      });
    }

    const query = interaction.options.getString('song', true);
    await interaction.deferReply();

    // Resolve song
    const song = await resolveSong(query);
    if (!song) {
      return interaction.editReply({
        flags: 32768,
        components: [
          {
            type: 17,
            components: [
              { type: 10, content: `### ${E.cross} **No Matches Found**\n> Could not find any song matching: \`${query}\`. Please try another name!` }
            ]
          }
        ]
      });
    }

    song.requestedBy = member.user.tag;
    song.requestedById = member.id;

    // Retrieve or establish queue & voice connection
    let queue = queues.get(guildId);
    if (!queue) {
      queue = new GuildQueue(guildId, channel, voiceChannel);
      queues.set(guildId, queue);
    } else {
      queue.textChannel = channel;
      queue.voiceChannel = voiceChannel;
    }

    // Connect to VC if not already connected
    if (!queue.connection || queue.connection.state.status === VoiceConnectionStatus.Destroyed) {
      try {
        queue.connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: guildId,
          adapterCreator: interaction.guild.voiceAdapterCreator
        });
        queue.connection.subscribe(queue.player);
        await entersState(queue.connection, VoiceConnectionStatus.Ready, 15_000);
      } catch (e) {
        console.error('[VOICE CONNECT ERROR]:', e);
        return interaction.editReply({
          content: `❌ Failed to join voice channel: ${e.message}`
        });
      }
    }

    // If nothing currently playing, play immediately
    if (!queue.isPlaying && !queue.currentSong) {
      queue.currentSong = song;
      await interaction.editReply({
        flags: 32768,
        components: [
          {
            type: 17,
            components: [
              {
                type: 10,
                content: `### ${E.lightning} **Loading Song...**\n> 🎵 Preparing **[${song.title}](${song.url})** (\`${song.duration}\`)...`
              }
            ]
          }
        ]
      });
      queue.playNext();
    } else {
      // Add to queue
      queue.songs.push(song);
      const position = queue.songs.length;
      return interaction.editReply({
        flags: 32768,
        components: [
          {
            type: 17,
            components: [
              {
                type: 10,
                content: `### ${E.sparkles} **Added to Queue**\n\n` +
                         `> 🎵 **[${song.title}](${song.url})**\n` +
                         `> ⏱️ **Duration:** \`${song.duration}\` • 👤 **Artist:** \`${song.author}\`\n` +
                         `> 🔢 **Position:** \`#${position}\` in queue • 🎧 **Requested By:** <@${song.requestedById}>`
              },
              {
                type: 10,
                content: `-# ${E.verifiedBlue} Dream Nodes Hi-Fi Audio Engine`
              }
            ]
          }
        ]
      });
    }
    return;
  }

  // Check existing queue for playback control commands
  const queue = queues.get(guildId);
  if (!queue && ['pause', 'resume', 'skip', 'skipto', 'stop', 'queue', 'nowplaying', 'volume', 'leave', 'autoplay'].includes(commandName)) {
    return interaction.reply({
      content: '❌ There is no active music playback in this server!',
      ephemeral: true
    });
  }

  if (commandName === 'pause') {
    if (queue.isPaused) {
      return interaction.reply({ content: '⚠️ The player is already paused!', ephemeral: true });
    }
    queue.player.pause();
    queue.isPaused = true;
    await queue.sendOrUpdateControlPanel();
    return interaction.reply({ content: '⏸️ Paused playback.', ephemeral: true });
  }

  if (commandName === 'resume') {
    if (!queue.isPaused) {
      return interaction.reply({ content: '⚠️ The player is already playing!', ephemeral: true });
    }
    queue.player.unpause();
    queue.isPaused = false;
    await queue.sendOrUpdateControlPanel();
    return interaction.reply({ content: '▶️ Resumed playback.', ephemeral: true });
  }

  if (commandName === 'skip') {
    if (!queue.currentSong) {
      return interaction.reply({ content: '❌ No track is currently playing to skip!', ephemeral: true });
    }
    const skippedTitle = queue.currentSong.title;
    queue.player.stop(); // triggers AudioPlayerStatus.Idle -> playNext()
    return interaction.reply({
      content: `⏭️ Skipped **${skippedTitle}**!`
    });
  }

  if (commandName === 'skipto') {
    const position = interaction.options.getInteger('position', true);
    if (position < 1 || position > queue.songs.length) {
      return interaction.reply({
        content: `❌ Invalid queue position. Current queue has **${queue.songs.length}** song(s).`,
        ephemeral: true
      });
    }
    // Remove preceding songs
    const removed = queue.songs.splice(0, position - 1);
    queue.player.stop();
    return interaction.reply({
      content: `⏭️ Skipped directly to song #${position}!`
    });
  }

  if (commandName === 'queue') {
    return showQueue(interaction, queue);
  }

  if (commandName === 'nowplaying') {
    if (!queue.currentSong) {
      return interaction.reply({ content: '❌ No song is currently playing!', ephemeral: true });
    }
    await queue.sendOrUpdateControlPanel();
    return interaction.reply({ content: '✅ Control panel updated in chat.', ephemeral: true });
  }

  if (commandName === 'volume') {
    const level = interaction.options.getInteger('level', true);
    queue.volume = level;
    if (queue.currentResource && queue.currentResource.volume) {
      queue.currentResource.volume.setVolume(level / 100);
    }
    await queue.sendOrUpdateControlPanel();
    return interaction.reply({
      content: `🔊 Volume set to **${level}%**!`
    });
  }

  if (commandName === 'autoplay') {
    const explicit = interaction.options.getBoolean('enabled');
    queue.autoplay = explicit !== null ? explicit : !queue.autoplay;
    await queue.sendOrUpdateControlPanel();
    return interaction.reply({
      content: `📻 Autoplay mode has been **${queue.autoplay ? 'ENABLED 🟢' : 'DISABLED ⚫'}**!${queue.autoplay ? '\nThe bot will automatically find and queue similar tracks when the queue finishes.' : ''}`
    });
  }

  if (commandName === 'stop' || commandName === 'leave') {
    queue.songs = [];
    queue.currentSong = null;
    queue.destroy();
    return interaction.reply({
      content: `⏹️ Playback stopped, queue cleared, and disconnected from voice channel.`
    });
  }
}

/**
 * Handle Music Control Panel Interactive Buttons
 */
async function handleMusicButton(interaction) {
  const { customId, guildId, member } = interaction;
  const queue = queues.get(guildId);

  if (!queue) {
    return interaction.reply({
      content: '❌ No active music session found for this server.',
      ephemeral: true
    });
  }

  const voiceChannel = member?.voice?.channel;
  if (!voiceChannel || voiceChannel.id !== queue.voiceChannel?.id) {
    return interaction.reply({
      content: '⚠️ You must be in the same voice channel as the bot to use the controls!',
      ephemeral: true
    });
  }

  if (customId === 'music_pause_resume') {
    if (queue.isPaused) {
      queue.player.unpause();
      queue.isPaused = false;
    } else {
      queue.player.pause();
      queue.isPaused = true;
    }
    await interaction.update(buildControlPanelPayload(queue));
    return;
  }

  if (customId === 'music_skip') {
    if (!queue.currentSong) {
      return interaction.reply({ content: '❌ No song currently playing to skip!', ephemeral: true });
    }
    const title = queue.currentSong.title;
    queue.player.stop();
    return interaction.reply({ content: `⏭️ Skipped **${title}**!`, ephemeral: true });
  }

  if (customId === 'music_stop') {
    queue.songs = [];
    queue.currentSong = null;
    await interaction.update(buildQueueEndedPayload());
    queue.destroy();
    return;
  }

  if (customId === 'music_loop') {
    if (queue.loopMode === 'off') queue.loopMode = 'track';
    else if (queue.loopMode === 'track') queue.loopMode = 'queue';
    else queue.loopMode = 'off';

    await interaction.update(buildControlPanelPayload(queue));
    return;
  }

  if (customId === 'music_queue') {
    return showQueue(interaction, queue);
  }

  if (customId === 'music_vol_down') {
    queue.volume = Math.max(10, queue.volume - 10);
    if (queue.currentResource?.volume) {
      queue.currentResource.volume.setVolume(queue.volume / 100);
    }
    await interaction.update(buildControlPanelPayload(queue));
    return;
  }

  if (customId === 'music_vol_up') {
    queue.volume = Math.min(150, queue.volume + 10);
    if (queue.currentResource?.volume) {
      queue.currentResource.volume.setVolume(queue.volume / 100);
    }
    await interaction.update(buildControlPanelPayload(queue));
    return;
  }

  if (customId === 'music_shuffle') {
    if (queue.songs.length < 2) {
      return interaction.reply({ content: '⚠️ Not enough songs in queue to shuffle!', ephemeral: true });
    }
    // Fisher-Yates shuffle
    for (let i = queue.songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue.songs[i], queue.songs[j]] = [queue.songs[j], queue.songs[i]];
    }
    await interaction.update(buildControlPanelPayload(queue));
    return interaction.followUp({ content: '🔀 Shuffled the upcoming queue!', ephemeral: true });
  }

  if (customId === 'music_autoplay') {
    queue.autoplay = !queue.autoplay;
    await interaction.update(buildControlPanelPayload(queue));
    return;
  }

  if (customId === 'music_disconnect') {
    queue.destroy();
    return interaction.update({
      content: '❌ Disconnected from voice channel.',
      components: []
    });
  }
}

/**
 * Display interactive queue list
 */
async function showQueue(interaction, queue) {
  const current = queue.currentSong;
  let queueList = '';

  if (queue.songs.length === 0) {
    queueList = '> *No upcoming songs in queue. Add more with `/play <song>`!*';
  } else {
    queueList = queue.songs
      .slice(0, 10)
      .map((s, idx) => `> **${idx + 1}.** [${s.title}](${s.url}) \`[${s.duration}]\` • <@${s.requestedById}>`)
      .join('\n');
    if (queue.songs.length > 10) {
      queueList += `\n> *...and ${queue.songs.length - 10} more song(s) in queue.*`;
    }
  }

  const content =
`# ${E.stats} **DREAM NODES ┃ MUSIC QUEUE** ${E.sparkles}

### ${E.lightning} **Currently Playing:**
> 🎵 **[${current ? current.title : 'None'}](${current ? current.url : ''})** \`[${current ? current.duration : '--:--'}]\`
> 👤 **Artist:** \`${current ? current.author : 'N/A'}\` • 🎧 **Requested By:** <@${current ? current.requestedById : ''}>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 📜 **Upcoming Tracks (${queue.songs.length}):**
${queueList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
> 🔊 **Volume:** \`${queue.volume}%\` • 🔁 **Loop Mode:** \`${queue.loopMode.toUpperCase()}\` • 📻 **Autoplay:** \`${queue.autoplay ? 'ON' : 'OFF'}\``;

  const payload = {
    flags: 32832, // Ephemeral Components V2
    components: [
      {
        type: 17,
        accent_color: null,
        components: [
          {
            type: 10,
            content: content
          },
          {
            type: 10,
            content: `-# ${E.verifiedBlue} Dream Nodes Hi-Fi Audio Engine`
          }
        ]
      }
    ]
  };

  if (interaction.isButton()) {
    return interaction.reply(payload);
  } else {
    return interaction.reply(payload);
  }
}

module.exports = {
  musicCommands,
  handleMusicCommand,
  handleMusicAutocomplete,
  handleMusicButton,
  queues
};
