require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

const guildId = '1573272872737181696';
const clientRoleId = '1573412778620747886'; // ⋆｡°✩ ƈʅιҽɳƚ ✩°｡⋆
const memberRoleId = '1573412782202818660'; // ⋆｡°✩ ɱҽɱႦҽɾ ✩°｡⋆
const sampadUserId = '699539012649615400'; // sampad_craft

client.once('clientReady', async () => {
  try {
    const guild = client.guilds.cache.get(guildId) || await client.guilds.fetch(guildId);
    const members = await guild.members.fetch();
    console.log(`Fetched ${members.size} members from ${guild.name}. Processing role reassignment...`);

    let clientRemovedCount = 0;
    let memberAddedCount = 0;

    for (const [id, member] of members) {
      if (member.user.bot) continue;

      if (id === sampadUserId) {
        // Ensure Sampad has Client role and Member role
        if (!member.roles.cache.has(clientRoleId)) {
          await member.roles.add(clientRoleId, 'Client role granted exclusively to Sampad');
        }
        if (!member.roles.cache.has(memberRoleId)) {
          await member.roles.add(memberRoleId, 'Member role granted to Sampad');
        }
        console.log(`✓ [SAMPAD CONFIRMED] ${member.user.tag} (${id}) has Client role & Member role.`);
      } else {
        // Remove Client role from everyone else
        if (member.roles.cache.has(clientRoleId)) {
          await member.roles.remove(clientRoleId, 'Removing Client role as per server restructuring');
          clientRemovedCount++;
          console.log(`- Removed Client role from ${member.user.tag} (${id})`);
        }
        // Add Member role to everyone
        if (!member.roles.cache.has(memberRoleId)) {
          await member.roles.add(memberRoleId, 'Assigning default Member role');
          memberAddedCount++;
          console.log(`+ Added Member role to ${member.user.tag} (${id})`);
        }
      }
    }

    console.log('\n--- ROLE REASSIGNMENT SUMMARY ---');
    console.log(`Total Client roles removed: ${clientRemovedCount}`);
    console.log(`Total Member roles assigned: ${memberAddedCount}`);
    console.log(`Sampad (${sampadUserId}) is now the only member with the Client role.`);

    client.destroy();
    process.exit(0);
  } catch (err) {
    console.error('Error during role reassignment:', err);
    client.destroy();
    process.exit(1);
  }
});

client.login(process.env.DISCORD_TOKEN).catch(console.error);
