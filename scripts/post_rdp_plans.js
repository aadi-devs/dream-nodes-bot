const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const token = fs.readFileSync(envPath, 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();
const channelId = '1573281556968112248'; // # ⚜・ʀᴅᴘ-ᴘʟᴀɴꜱ
const ticketChannelUrl = 'https://discord.com/channels/1573272872737181696/1573281601775870043';
const websiteUrl = 'https://dreamnodes.cloud';
const howToBuyUrl = 'https://discord.com/channels/1573272872737181696/1573281597464121425';

const sectionHeader =
`# <:vps:1573382507863220246> 𝐃𝐑𝐄𝐀𝐌 𝐍𝐎𝐃𝐄𝐒 ┃ Premium Windows RDP Hosting
## <a:location:1573382361574277130> 🇮🇳 India Datacenter (Noida) • Intel Xeon • Full Administrator Access

> <a:Attacks:1573382140006244363> **Dedicated Cloud Windows Desktops:** Powered by high-clock Intel Xeon 8269-CY processors, high-speed DDR4 ECC RAM, and pure NVMe SSDs. Instant RDP access with full administrator privileges, pre-installed Windows Server, and unmetered 1 Gbps bandwidth.`;

const sectionSmall =
`### <a:b_fire:1573381944702533732> Starter Windows RDP (Light Tasks & Browsing)

> 🖥️ **RDP XS** \`[ ENTRY ]\` ── <a:cash:1573382269735805008> **\`₹549 /mo\`**
> <:cpu:1573382485310709781> \`3 Intel vCores\` ┃ <:RAM:1573382492973568062> \`8 GB ECC RAM\` ┃ <:disk:1573382500795818114> \`80 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\`
> 
> 🖥️ **RDP S** \`[ STARTER ]\` ── <a:cash:1573382269735805008> **\`₹749 /mo\`**
> <:cpu:1573382485310709781> \`4 Intel vCores\` ┃ <:RAM:1573382492973568062> \`12 GB ECC RAM\` ┃ <:disk:1573382500795818114> \`100 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\``;

const sectionMedium =
`### <a:Lightning:1573382171257737317> Professional Windows RDP (Multi-Tasking & Bots)

> ⚡ **RDP M** \`[ STANDARD ]\` ── <a:cash:1573382269735805008> **\`₹1,099 /mo\`**
> <:cpu:1573382485310709781> \`6 Intel vCores\` ┃ <:RAM:1573382492973568062> \`16 GB ECC RAM\` ┃ <:disk:1573382500795818114> \`150 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\`
> 
> ⚡ **RDP L** \`[ PLUS ]\` ── <a:cash:1573382269735805008> **\`₹1,499 /mo\`**
> <:cpu:1573382485310709781> \`8 Intel vCores\` ┃ <:RAM:1573382492973568062> \`24 GB ECC RAM\` ┃ <:disk:1573382500795818114> \`200 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\`
> 
> ⚡ **RDP XL** \`[ PRO ]\` ── <a:cash:1573382269735805008> **\`₹1,899 /mo\`**
> <:cpu:1573382485310709781> \`10 Intel vCores\` ┃ <:RAM:1573382492973568062> \`32 GB ECC RAM\` ┃ <:disk:1573382500795818114> \`300 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\``;

const sectionBig =
`### <a:RedCrown:1573382179298353186> Heavyweight Enterprise RDP (Heavy Workloads & Emulators)

> 👑 **RDP XXL** \`[ POWER ]\` ── <a:cash:1573382269735805008> **\`₹2,299 /mo\`**
> <:cpu:1573382485310709781> \`12 Intel vCores\` ┃ <:RAM:1573382492973568062> \`48 GB ECC RAM\` ┃ <:disk:1573382500795818114> \`350 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\`
> 
> 👑 **RDP 2XL** \`[ ELITE ]\` ── <a:cash:1573382269735805008> **\`₹2,799 /mo\`**
> <:cpu:1573382485310709781> \`16 Intel vCores\` ┃ <:RAM:1573382492973568062> \`64 GB ECC RAM\` ┃ <:disk:1573382500795818114> \`400 GB NVMe\` ┃ <:bandwith55:1573382523201912842> \`1 Gbps Unmetered\``;

const sectionFeatures =
`### <a:sparkles_sparkles:1573382447603785928> Core Windows RDP Capabilities & Inclusions:
> 🔑 **100% Full Admin Access:** Complete administrative control. Install any desktop app, bot, emulator, or tools.
> 🖥️ **Windows Remote Desktop:** Connect smoothly via Windows MSTSC, macOS, iOS, or Android devices.
> 🇮🇳 **Hosted in Noida, India:** Ultra-low ping and direct domestic routing across India and South Asia.
> 🛡️ **Advanced Anti-DDoS Mitigation:** Real-time multi-Tbps traffic scrubbing protecting your connection 24/7.
> <:bandwith55:1573382523201912842> **Truly Unmetered 1 Gbps Port:** Run uploads and downloads with zero data caps or speed throttling.
> 💽 **Pure Gen4 NVMe Storage:** Fast drive read/write speeds for instantaneous desktop responsiveness.
> 🚀 **Instant Setup:** Fast automated deployment dispatched immediately upon ticket verification.`;

const v2Payload = {
  flags: 32768, // IS_COMPONENTS_V2
  components: [
    {
      type: 17, // Borderless Container
      components: [
        {
          type: 10,
          content: sectionHeader
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionSmall
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionMedium
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionBig
        },
        {
          type: 14,
          divider: true,
          spacing: 1
        },
        {
          type: 10,
          content: sectionFeatures
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
              style: 5,
              label: 'Order RDP Server / Open Ticket',
              url: ticketChannelUrl,
              emoji: { name: '🖥️' }
            },
            {
              type: 2,
              style: 5,
              label: 'Official Website',
              url: websiteUrl,
              emoji: { name: '🌐' }
            },
            {
              type: 2,
              style: 5,
              label: 'How To Buy',
              url: howToBuyUrl,
              emoji: { name: '📖' }
            }
          ]
        },
        {
          type: 10,
          content: '-# 🖥️ Dream Nodes • Enterprise High-Speed Windows RDP Cloud Desktops'
        }
      ]
    }
  ]
};

async function postRdpPlans() {
  console.log('Posting Windows RDP Plans V2 Container to channel', channelId);
  const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(v2Payload)
  });

  const data = await res.json();
  if (data.id) {
    console.log('✓ Successfully posted Windows RDP embed! Message ID:', data.id);
    
    // Add reactions
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${data.id}/reactions/%F0%9F%96%A5%EF%B8%8F/@me`, { // 🖥️
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${data.id}/reactions/%E2%9A%A1/@me`, { // ⚡
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` }
    });
  } else {
    console.error('✗ Failed to post:', JSON.stringify(data, null, 2));
  }
}

postRdpPlans();
