const fs = require('fs');
const files = [
  'post_advance_plans.js',
  'post_mc_india_offer.js',
  'post_intel_vps_plans.js',
  'post_amd_epyc_vps.js',
  'post_singapore_intel_vps.js',
  'post_singapore_amd_vps.js',
  'post_vps_offer.js',
  'post_domain_plans.js',
  'post_bot_hosting_plans.js',
  'post_rdp_plans.js',
  'post_web_hosting_plans.js',
  'post_storage_servers.js',
  'post_boost_perks.js',
  'post_invite_perks.js',
  'post_ticket_panel.js',
  'post_budget_nodes_plans.js',
  'post_changelog.js',
  'post_terms_embed.js'
];

files.forEach(f => {
  const p = 'scripts/' + f;
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, 'utf8');
    const chMatch = content.match(/channelId\s*=\s*['"]([^'"]+)['"]/);
    const msgMatch = content.match(/messageId\s*=\s*['"]([^'"]+)['"]/);
    console.log(f.padEnd(28), 'Ch:', chMatch ? chMatch[1] : 'none', 'Msg:', msgMatch ? msgMatch[1] : 'none');
  }
});
