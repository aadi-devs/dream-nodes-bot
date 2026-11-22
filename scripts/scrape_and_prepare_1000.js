const fs = require('fs');
const path = require('path');

const themeBuckets = [
  {
    name: 'Hardware, Servers & Tech',
    target: 150,
    terms: ['server', 'cloud', 'vps', 'node', 'host', 'datacenter', 'proxmox', 'linux', 'docker', 'pterodactyl', 'cpanel', 'terminal', 'network', 'ping', 'speed', 'wifi', 'cpu', 'intel', 'amd', 'ryzen', 'processor', 'ram', 'memory', 'disk', 'nvme', 'ssd', 'database', 'code']
  },
  {
    name: 'Arrows, Bullets & Pointers',
    target: 100,
    terms: ['arrow', 'pointer', 'cursor', 'bullet', 'dot', 'next', 'direction']
  },
  {
    name: 'Stars, Sparkles & Glitter',
    target: 100,
    terms: ['sparkle', 'sparkles', 'glitter', 'star', 'stars', 'shootingstar', 'galaxy', 'rainbow', 'magic', 'shine']
  },
  {
    name: 'Fire, Flames, Ice & Plasma',
    target: 100,
    terms: ['fire', 'flame', 'bluefire', 'purplefire', 'bonfire', 'burn', 'ice', 'freeze', 'cold', 'plasma']
  },
  {
    name: 'Lightning, Energy & Neon',
    target: 100,
    terms: ['lightning', 'zap', 'thunder', 'storm', 'electric', 'energy', 'neon', 'glow', 'pulse', 'laser', 'orb']
  },
  {
    name: 'Ticks, Checks, Alerts & Warnings',
    target: 100,
    terms: ['tick', 'check', 'verified', 'cross', 'error', 'deny', 'warn', 'warning', 'alert', 'siren', 'bell', 'loading', 'spinner', 'timer', 'clock', 'sync']
  },
  {
    name: 'Money, Cash & Offers',
    target: 100,
    terms: ['money', 'cash', 'coin', 'dollar', 'crypto', 'bitcoin', 'card', 'payment', 'wallet', 'offer', 'sale', 'discount', 'deal', 'gift', 'cart', 'shop']
  },
  {
    name: 'Crowns, Badges & Security',
    target: 100,
    terms: ['crown', 'king', 'queen', 'vip', 'gold', 'diamond', 'emerald', 'ruby', 'gem', 'trophy', 'medal', 'shield', 'protect', 'lock', 'key']
  },
  {
    name: 'Gaming & Minecraft',
    target: 75,
    terms: ['minecraft', 'creeper', 'portal', 'sword', 'game', 'gamepad', 'controller', 'headset', 'pixel', 'heart']
  },
  {
    name: 'Community, Hype, Dance & Common',
    target: 75,
    terms: ['party', 'dance', 'hype', 'clap', 'vibing', 'cat', 'pepe', 'blob', 'wave', 'hi', 'cool', 'matrix', 'glitch', 'robot', 'salute']
  }
];

async function search7TVTerm(term, limit = 50, page = 1) {
  const gql = `query SearchEmotes($query: String!, $limit: Int!, $page: Int!) {
    emotes(query: $query, limit: $limit, page: $page, filter: { animated: true }) {
      items {
        id
        name
        animated
        host {
          url
          files {
            name
            format
            width
            height
          }
        }
      }
    }
  }`;

  try {
    const res = await fetch('https://7tv.io/v3/gql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: gql, variables: { query: term, limit, page } })
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.emotes?.items || [];
  } catch (e) {
    return [];
  }
}

function sanitizeName(name, fallbackPrefix = 'dn_') {
  let clean = name.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  if (clean.length < 2) clean = fallbackPrefix + clean;
  if (clean.length > 32) clean = clean.substring(0, 32).replace(/_+$/g, '');
  return clean;
}

async function prepareBalanced1000() {
  console.log(`Starting balanced curation across ${themeBuckets.length} theme categories...`);

  const seenIds = new Set();
  const nameCounts = {};
  const selectedEmotes = [];

  for (const bucket of themeBuckets) {
    const bucketItems = [];
    console.log(`\nCollecting for [${bucket.name}] (Target: ${bucket.target})...`);

    for (const term of bucket.terms) {
      if (bucketItems.length >= bucket.target) break;

      const items = await search7TVTerm(term, 30, 1);
      for (const item of items) {
        if (!item.animated) continue;
        if (seenIds.has(item.id)) continue;

        seenIds.add(item.id);

        let sName = sanitizeName(item.name);
        if (!nameCounts[sName]) {
          nameCounts[sName] = 1;
        } else {
          nameCounts[sName]++;
          sName = `${sName}_${nameCounts[sName]}`.substring(0, 32);
        }

        bucketItems.push({
          id: item.id,
          originalName: item.name,
          discordName: sName,
          category: bucket.name,
          searchTerm: term,
          animated: true,
          gifUrl: `https://cdn.7tv.app/emote/${item.id}/1x.gif`
        });

        if (bucketItems.length >= bucket.target) break;
      }
    }

    console.log(`✓ [${bucket.name}]: Selected ${bucketItems.length} animated emotes.`);
    selectedEmotes.push(...bucketItems);
  }

  console.log(`\n===========================================`);
  console.log(`Total Curated Animated Emotes: ${selectedEmotes.length}`);
  console.log(`===========================================`);

  // Ensure exactly 1000 (if slightly under, fill from top terms)
  if (selectedEmotes.length < 1000) {
    const needed = 1000 - selectedEmotes.length;
    console.log(`Filling remaining ${needed} slots with trending animated emotes...`);
    const extra = await search7TVTerm('vibe', needed + 20, 1);
    for (const item of extra) {
      if (selectedEmotes.length >= 1000) break;
      if (!seenIds.has(item.id) && item.animated) {
        seenIds.add(item.id);
        let sName = sanitizeName(item.name);
        if (!nameCounts[sName]) {
          nameCounts[sName] = 1;
        } else {
          nameCounts[sName]++;
          sName = `${sName}_${nameCounts[sName]}`.substring(0, 32);
        }
        selectedEmotes.push({
          id: item.id,
          originalName: item.name,
          discordName: sName,
          category: 'Trending',
          searchTerm: 'vibe',
          animated: true,
          gifUrl: `https://cdn.7tv.app/emote/${item.id}/1x.gif`
        });
      }
    }
  }

  const final1000 = selectedEmotes.slice(0, 1000);
  const outPath = path.join(__dirname, 'emojis_1000_prepared.json');
  fs.writeFileSync(outPath, JSON.stringify(final1000, null, 2), 'utf8');

  console.log(`✓ Saved exactly ${final1000.length} curated animated emojis to ${outPath}`);
}

prepareBalanced1000().catch(console.error);
