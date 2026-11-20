const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const guildId = '1573272872737181696';

const fontMap = {
  a: 'α', b: 'Ⴆ', c: 'ƈ', d: 'ԃ', e: 'ҽ', f: 'ϝ', g: 'ɠ', h: 'ԋ',
  i: 'ι', j: 'ʝ', k: 'ƙ', l: 'ʅ', m: 'ɱ', n: 'ɳ', o: 'σ', p: 'ρ',
  q: 'ϙ', r: 'ɾ', s: 'ʂ', t: 'ƚ', u: 'υ', v: 'ʋ', w: 'ɯ', x: 'x',
  y: 'ყ', z: 'ζ'
};

function toAesthetic(text) {
  return '⋆｡°✩ ' + text.toLowerCase().split('').map(c => fontMap[c] || c).join('') + ' ✩°｡⋆';
}

// Complete role hierarchy from highest (Founder) to lowest (Member/Bots)
const roleDefinitions = [
  // Executive Leadership
  { title: 'founder', color: 0xE74C3C, hoist: true, mentionable: false },
  { title: 'ceo', color: 0x9B59B6, hoist: true, mentionable: false },
  { title: 'coo', color: 0xE056FD, hoist: true, mentionable: false },
  { title: 'manager', color: 0x706FD3, hoist: true, mentionable: false },

  // Development & Infrastructure
  { title: 'developer', color: 0x00CEC9, hoist: true, mentionable: false },
  { title: 'sysadmin', color: 0x0984E3, hoist: true, mentionable: false },

  // Staff & Moderation
  { title: 'admin', color: 0xFA5252, hoist: true, mentionable: false },
  { title: 'head mod', color: 0xF39C12, hoist: true, mentionable: false },
  { title: 'moderator', color: 0xF1C40F, hoist: true, mentionable: false },
  { title: 'support', color: 0x2ECC71, hoist: true, mentionable: true },
  { title: 'trial staff', color: 0x1ABC9C, hoist: true, mentionable: false },

  // Partners & Special
  { title: 'partner', color: 0x4834D4, hoist: true, mentionable: false },
  { title: 'creator', color: 0xFF7979, hoist: true, mentionable: false },
  { title: 'booster', color: 0xF47FFF, hoist: true, mentionable: false },
  { title: 'vip', color: 0xFFEAA7, hoist: true, mentionable: false },

  // Community & Client Base
  { title: 'client', color: 0x74B9FF, hoist: true, mentionable: false },
  { title: 'member', color: 0xDFE6E9, hoist: true, mentionable: false },
  { title: 'bots', color: 0x636E72, hoist: true, mentionable: false },

  // Ping / Notification Roles (non-hoisted)
  { title: 'announcements', color: 0xA4B0BE, hoist: false, mentionable: true },
  { title: 'updates', color: 0xA4B0BE, hoist: false, mentionable: true },
  { title: 'giveaways', color: 0xA4B0BE, hoist: false, mentionable: true }
];

async function createRoles() {
  const existingRoles = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
    headers: { Authorization: 'Bot ' + token }
  }).then(r => r.json());

  console.log(`Found ${existingRoles.length} existing roles.`);
  const createdRoles = [];

  for (const def of roleDefinitions) {
    const formattedName = toAesthetic(def.title);
    const existing = existingRoles.find(r => r.name === formattedName);

    if (existing) {
      console.log(`Role already exists: ${formattedName} (${existing.id})`);
      createdRoles.push({ id: existing.id, name: formattedName, ...def });
      continue;
    }

    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
      method: 'POST',
      headers: {
        Authorization: 'Bot ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formattedName,
        color: def.color,
        hoist: def.hoist,
        mentionable: def.mentionable
      })
    });

    const data = await res.json();
    if (data.id) {
      console.log(`Created role: ${formattedName} (ID: ${data.id})`);
      createdRoles.push({ id: data.id, name: formattedName, ...def });
    } else {
      console.error(`Failed to create ${formattedName}:`, data);
    }

    // Small delay to respect rate limits
    await new Promise(r => setTimeout(r, 250));
  }

  // Reorder created roles in hierarchy order:
  // Lowest index in roleDefinitions (Founder) should be near the top, highest index (giveaways) near the bottom.
  console.log('Reordering roles into correct hierarchy...');
  const positionsPayload = createdRoles.map((role, idx) => ({
    id: role.id,
    position: createdRoles.length - idx
  }));

  const patchRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
    method: 'PATCH',
    headers: {
      Authorization: 'Bot ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(positionsPayload)
  });

  console.log('Reorder status:', patchRes.status);
  console.log('\nAll roles setup complete!');
}

createRoles();
