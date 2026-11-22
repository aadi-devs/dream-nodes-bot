const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();

// Target channel: # 𖹭ᐟ・ᴄʜᴀɴɢᴇʟᴏɢꜱ (1573281468145336441)
const changelogChannelId = '1573281468145336441';
const clientRoleId = '1573412778620747886'; // ⋆｡°✩ ƈʅιҽɳƚ ✩°｡⋆
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';
const websiteUrl = 'https://dreamnodes.host';

const changelogMarkdown = 
`# <a:updates:1573382469938446390> **DREAM NODES ┃ SYSTEM CHANGELOG** <a:sparkles_sparkles:1573382447603785928>

╭・<a:announce:1573382228795457687> **Control Panel & System Infrastructure Update**
╰┈➤ <a:Lightning:1573382171257737317> **Version 1.2.0 • Feature & Proxy Release**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### <a:settings:1573382421611806763> **What's New in this Release:**

> \`~\` 🎨 **Panel Theme Updated (Nebula)**
> The server management dashboard has been upgraded to the high-performance **Nebula Theme**, offering an ultra-clean modern UI, improved mobile responsiveness, and dark-mode optimization.
> 
> \`~\` 👤 **Client Account Registration Added**
> Direct user self-registration is now fully operational on the panel! New clients can immediately create accounts and manage servers with zero onboarding delay.
> 
> \`~\` 🚀 **Velocity Proxy Egg & Java 25 Support Added**
> Official **Velocity Proxy** egg has been introduced into our Minecraft node catalog, pre-configured and updated with support for modern Java runtimes (including Java 25 & 21 LTS) for optimal network routing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<a:Tick5:1573382205395177532> Next-Gen NVMe Arrays • Instant Node Synchronization • Automated DDoS Mitigation
<a:Tick5:1573382205395177532> Active 24/7 Client Care • 99.9% Infrastructure Uptime SLA

📩 **Have questions or need assistance?** Open a ticket in <#1573281601775870043> ||<@&${clientRoleId}>||
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
          type: 1, // Action Row with Buttons
          components: [
            {
              type: 2,
              style: 5,
              label: 'Client Panel',
              url: websiteUrl,
              emoji: { name: '🌐' }
            },
            {
              type: 2,
              style: 5,
              label: 'Open a Ticket',
              url: ticketChannelUrl,
              emoji: { name: '🎫' }
            },
            {
              type: 2,
              style: 5,
              label: 'How To Buy',
              url: howToBuyUrl,
              emoji: { name: '📖' }
            },
            {
              type: 2,
              style: 5,
              label: 'Official Website',
              url: websiteUrl,
              emoji: { name: '📜' }
            }
          ]
        },
        {
          type: 10,
          content: '-# 💙 Dream Nodes • High-Performance Cloud Hosting & 24/7 Client Care Desk'
        }
      ]
    }
  ]
};

async function postChangelog() {
  console.log('Posting Changelog to # 𖹭ᐟ・ᴄʜᴀɴɢᴇʟᴏɢꜱ:', changelogChannelId);

  const res = await fetch(`https://discord.com/api/v10/channels/${changelogChannelId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(v2Payload)
  });

  const data = await res.json();
  if (data.id) {
    console.log('✓ Successfully posted Changelog! Message ID:', data.id);

    // Add reactions
    await fetch(`https://discord.com/api/v10/channels/${changelogChannelId}/messages/${data.id}/reactions/%E2%9A%A1/@me`, { // ⚡
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
    await fetch(`https://discord.com/api/v10/channels/${changelogChannelId}/messages/${data.id}/reactions/%F0%9F%8E%AB/@me`, { // 🎫
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
    await fetch(`https://discord.com/api/v10/channels/${changelogChannelId}/messages/${data.id}/reactions/%F0%9F%9A%80/@me`, { // 🚀
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
    console.log('✓ Reactions added to Changelog message');
  } else {
    console.error('✗ Failed to post Changelog:', JSON.stringify(data, null, 2));
  }
}

if (process.argv.includes('--send')) {
  postChangelog();
} else {
  console.log('Dry run: Use --send to actually dispatch to Discord.');
}
