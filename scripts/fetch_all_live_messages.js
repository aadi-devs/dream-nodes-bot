const fs = require('fs');
const path = require('path');

const token = fs.readFileSync('.env', 'utf8').match(/DISCORD_TOKEN=(.*)/)[1].trim();

const targets = [
  { name: 'advance_plans', channelId: '1573281486822445128', messageId: '1573688254908207249', script: 'post_advance_plans.js' },
  { name: 'offers_mc_india', channelId: '1573281500290359338', messageId: '1574087340283138239', script: 'post_mc_india_offer.js' },
  { name: 'intel_vps_plans', channelId: '1573281509140336816', messageId: '1573741063175151717', script: 'post_intel_vps_plans.js' },
  { name: 'amd_epyc_vps', channelId: '1573281514165248091', messageId: '1573742677328007210', script: 'post_amd_epyc_vps.js' },
  { name: 'singapore_intel_vps', channelId: '1573281518787494048', messageId: '1573767120104202341', script: 'post_singapore_intel_vps.js' },
  { name: 'singapore_amd_vps', channelId: '1573281523380133910', messageId: '1573767507922133024', script: 'post_singapore_amd_vps.js' },
  { name: 'auctions_vps_offer', channelId: '1573281528031481967', messageId: '1574087291578613771', script: 'post_vps_offer.js' },
  { name: 'domain_plans', channelId: '1573281547564359710', messageId: '1573746263441022988', script: 'post_domain_plans.js' },
  { name: 'bot_hosting_plans', channelId: '1573281551746207778', messageId: '1573747139039985847', script: 'post_bot_hosting_plans.js' },
  { name: 'rdp_plans', channelId: '1573281556968112248', messageId: '1573766690842476596', script: 'post_rdp_plans.js' },
  { name: 'web_hosting_plans', channelId: '1573281561493766164', messageId: '1573766242203078758', script: 'post_web_hosting_plans.js' },
  { name: 'storage_servers', channelId: '1573281565763567676', messageId: '1573765844138197184', script: 'post_storage_servers.js' },
  { name: 'invite_perks', channelId: '1573281579092938793', messageId: '1573744287676375172', script: 'post_invite_perks.js' },
  { name: 'boost_perks', channelId: '1573281583388168297', messageId: '1573744973294084168', script: 'post_boost_perks.js' },
  { name: 'create_ticket', channelId: '1573281601775870043', messageId: '1573773937383440486', script: 'post_ticket_panel.js' },
  { name: 'budget_nodes_plans', channelId: '1573712408554377336', messageId: '1573738387918299259', script: 'post_budget_nodes_plans.js' },
  { name: 'changelogs', channelId: '1573281468145336441', messageId: '1574093615750189131', script: 'post_changelog.js' },
  { name: 'terms_and_refund', channelId: '1573337303538208778', messageId: '1573410085298774218', script: 'post_terms_embed.js' },
  { name: 'dont_msg_here', channelId: '1573337296042729502', messageId: '1573402481214492685', script: null }
];

const outDir = path.join(__dirname, '..', 'data', 'live_messages');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

(async () => {
  for (const t of targets) {
    const res = await fetch(`https://discord.com/api/v10/channels/${t.channelId}/messages/${t.messageId}`, {
      headers: { Authorization: `Bot ${token}` }
    });
    const data = await res.json();
    fs.writeFileSync(path.join(outDir, `${t.name}.json`), JSON.stringify(data, null, 2));
    console.log(`Fetched ${t.name}:`, data.id ? 'SUCCESS' : data.message);
  }
})();
