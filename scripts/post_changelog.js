const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();

// Target channel: # 𖹭ᐟ・ᴄʜᴀɴɢᴇʟᴏɢꜱ (1573281468145336441)
const changelogChannelId = '1573281468145336441';
const clientRoleId = '1573412778620747886'; // ⋆｡°✩ ƈʅιҽɳƚ ✩°｡⋆
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';
const websiteUrl = 'https://dreamnodes.cloud';
const panelUrl = 'https://panel.dreamnodes.cloud';

// 100% Custom & Animated Emojis only — Zero standard/normal Unicode emojis
const changelogMarkdown = 
`# <a:updates:1573382469938446390> **DREAM NODES ┃ SYSTEM CHANGELOG** <a:sparkles_sparkles:1573382447603785928>

╭・<a:announce:1573382228795457687> **Control Panel & System Infrastructure Update**
╰┈➤ <a:Lightning:1573382171257737317> **Version 1.2.0 • Feature & Proxy Release**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### <a:settings:1573382421611806763> **What's New in this Release:**

> \`~\` <a:hostinger:1573382335355691089> **Panel Theme Updated (Nebula)**
> The server management dashboard has been upgraded to the high-performance **Nebula Theme**, offering an ultra-clean modern UI, improved mobile responsiveness, and dark-mode optimization.
> 
> \`~\` <a:membership:1573382371699458201> **Client Account Registration Added**
> Direct user self-registration is now fully operational on the panel! New clients can immediately create accounts and manage servers with zero onboarding delay.
> 
> \`~\` <a:Rocket:1573382186546102347> **Velocity Proxy Egg & Java 25 Support Added**
> Official **Velocity Proxy** egg has been introduced into our Minecraft node catalog, pre-configured and updated with support for modern Java runtimes (including Java 25 & 21 LTS) for optimal network routing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<a:Tick5:1573382205395177532> Next-Gen NVMe Arrays • Instant Node Synchronization • Automated DDoS Mitigation
<a:Tick5:1573382205395177532> Active 24/7 Client Care • 99.9% Infrastructure Uptime SLA

<a:chat:1573382277164040214> **Have questions or need assistance?** Open a ticket in <#1573281601775870043> ||<@&${clientRoleId}>||
${ticketChannelUrl}`;

const v2Payload = {
  flags: 32768, // IS_COMPONENTS_V2
  components: [
    {
      type: 17, // Borderless Container
      components: [
        {
          type: 10,
          content: changelogMarkdown
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 1, // Action Row with Buttons (100% custom emojis)
          components: [
            {
              type: 2,
              style: 5,
              label: 'Client Panel',
              url: panelUrl,
              emoji: { id: '1573382507863220246', name: 'vps' }
            },
            {
              type: 2,
              style: 5,
              label: 'Open a Ticket',
              url: ticketChannelUrl,
              emoji: { id: '1573382277164040214', name: 'chat', animated: true }
            },
            {
              type: 2,
              style: 5,
              label: 'How To Buy',
              url: howToBuyUrl,
              emoji: { id: '1573382351214354483', name: 'info', animated: true }
            },
            {
              type: 2,
              style: 5,
              label: 'Official Website',
              url: websiteUrl,
              emoji: { id: '1573382112436949044', name: '2251worldrainbow', animated: true }
            }
          ]
        },
        {
          type: 10,
          content: '-# <a:Rotating_Star:1573382194020491317> Dream Nodes • High-Performance Cloud Hosting & 24/7 Client Care Desk'
        }
      ]
    }
  ]
};

async function editChangelog() {
  console.log('Fetching latest changelog message from # 𖹭ᐟ・ᴄʜᴀɴɢᴇʟᴏɢꜱ:', changelogChannelId);

  const getRes = await fetch(`https://discord.com/api/v10/channels/${changelogChannelId}/messages?limit=5`, {
    headers: { Authorization: `Bot ${token}` }
  });
  const msgs = await getRes.json();
  if (!Array.isArray(msgs) || msgs.length === 0) {
    console.error('No message found in changelogs channel');
    return;
  }

  const msgId = msgs[0].id;
  console.log('Editing message in place:', msgId);

  const patchRes = await fetch(`https://discord.com/api/v10/channels/${changelogChannelId}/messages/${msgId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(v2Payload)
  });

  const patchData = await patchRes.json();
  if (patchData.id) {
    console.log('✓ Successfully edited Changelog message to 100% custom emojis! Message ID:', patchData.id);

    // Delete normal reactions
    await fetch(`https://discord.com/api/v10/channels/${changelogChannelId}/messages/${msgId}/reactions`, {
      method: 'DELETE',
      headers: { Authorization: `Bot ${token}` }
    });

    // Add custom animated reactions
    await fetch(`https://discord.com/api/v10/channels/${changelogChannelId}/messages/${msgId}/reactions/Lightning:1573382171257737317/@me`, {
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
    await fetch(`https://discord.com/api/v10/channels/${changelogChannelId}/messages/${msgId}/reactions/Rocket:1573382186546102347/@me`, {
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
    await fetch(`https://discord.com/api/v10/channels/${changelogChannelId}/messages/${msgId}/reactions/Tick5:1573382205395177532/@me`, {
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
    console.log('✓ Added custom animated reactions to Changelog');
  } else {
    console.error('✗ Failed to patch Changelog:', JSON.stringify(patchData, null, 2));
  }
}

editChangelog();
