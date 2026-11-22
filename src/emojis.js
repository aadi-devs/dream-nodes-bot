const botEmojis = require('../data/bot_emojis.json');
const botEmojiNameMap = new Map();

for (const e of botEmojis) {
  // Store by exact name and lower-case name
  botEmojiNameMap.set(e.name, e);
  botEmojiNameMap.set(e.name.toLowerCase(), e);
}

function getEmoji(name, mustBeAnimated = null) {
  const norm = name.toLowerCase();
  let found = botEmojiNameMap.get(norm);
  if (found && mustBeAnimated !== null && found.animated !== mustBeAnimated) {
    found = botEmojis.find(e => e.name.toLowerCase() === norm && e.animated === mustBeAnimated);
  }
  if (!found) {
    found = botEmojis.find(e => e.name.toLowerCase().includes(norm) && (mustBeAnimated === null || e.animated === mustBeAnimated));
  }
  if (!found) {
    throw new Error(`Emoji not found for: ${name} (animated: ${mustBeAnimated})`);
  }
  return {
    id: found.id,
    name: found.name,
    animated: found.animated,
    tag: (found.animated ? '<a:' : '<:') + found.name + ':' + found.id + '>',
    btn: { id: found.id, name: found.name, animated: found.animated }
  };
}

const E = {};
const B = {};

function register(key, emojiName, mustBeAnimated = null) {
  const item = getEmoji(emojiName, mustBeAnimated);
  E[key] = item.tag;
  B[key] = item.btn;
}

// Bullets & Navigation (ANIMATED)
register('arrowBlue', 'animatedarrowbluelite', true);
register('arrowOrange', 'animatedarroworange', true);
register('arrowGreen', 'animatedarrowgreen', true);
register('arrowDarkBlue', 'darkbluearrow', true);
register('arrowWhite', 'arrow_white', true);
register('arrowRight', 'arrow_right_1', true);
register('pinkArrow', 'pinkarrow_right', true);
register('orangeDot', 'orangedot', true);
register('greenDot', 'greendot', true);
register('redDot', 'reddot', true);

// Flare & Prestige (ANIMATED)
register('fireBlue', 'b_fire', true);
register('fireRed', 'redfire', true);
register('fireWorld', 'firemc_animated_world', true);
register('lightning', 'lightning', true);
register('diamond', 'diamondshine', true);
register('starRotating', 'rotating_star', true);
register('sparkles', 'sparkles_sparkles', true);
register('star', 'star', true);
register('crown', 'crown', true);
register('crownRed', 'redcrown', true);
register('crownGreen', 'greencrown', true);
register('vip', 'vip', true);
register('goldMedal', 'gold_medal_gif', true);
register('silverMedal', 'silver_medal_gif', true);
register('bronzeMedal', 'bronze_medal_gif', true);

// Gaming & Hosting (ANIMATED)
register('sword', 'minecraftnetheritesword', true);
register('pvpSword', 'pvp_sword_gif', true);
register('minecraft', 'minecraft', true);
register('minecraft2', 'minecraft_2', true);
register('enchantedBook', 'enchanted_book', true);
register('craftingTable', 'craftingtable', true);
register('chest', 'chest', true);
register('shulker', 'shulker', true);
register('clouds', 'clouds_gif', true);
register('hostinger', 'hostinger', true);
register('bots', 'bots', true);
register('android', 'android', true);
register('gear', 'gear', true);
register('gearsLoading', 'gears_loading', true);
register('controller', 'controller', true);

// Flags & Locations (ANIMATED)
register('world', 'worldrainbow', true);
register('location', 'location', true);
register('india', 'indian', true);
register('singapore', 'singapore', true);
register('germany', 'germany_1', true);

// Alerts, Security, System (ANIMATED)
register('alert', 'alert', true);
register('alert2', 'alert_2', true);
register('siren', 'siren', true);
register('stopSign', 'stop_sign_gif', true);
register('noooo', 'noooooo', true);
register('security', 'security', true);
register('attacks', 'attacks', true);
register('verifiedBlue', 'verified_blue', true);
register('verified', 'verified', true);
register('tick5', 'tick5', true);
register('thehellCheck', 'thehell_check', true);
register('redCheck', 'red_check', true);

// Support, Commerce, Engagement (ANIMATED)
register('ticket', 'maketicket', true);
register('chat', 'chat', true);
register('supporter', 'supporter', true);
register('money', 'money', true);
register('cash', 'cash', true);
register('payments', 'payments', true);
register('shoppingCart', 'shoppingcart', true);
register('nitro', 'nitrospin', true);
register('booster', 'booster', true);
register('rocket', 'rocket', true);
register('gift', 'gift', true);
register('gift2', 'gift_2', true);
register('giveaway', 'giveaway', true);
register('rulesBook', 'rules_book', true);
register('updates', 'updates', true);
register('settings', 'settings', true);
register('announce', 'announce', true);
register('info', 'info', true);
register('pin', 'pin', true);
register('membership', 'membership', true);
register('timer', 'timer', true);
register('staff', 'staff', true);
register('cross', 'cross', true);
register('discord', 'discord_discord', true);
register('whiteHeart', 'whiteheart', true);
register('pinkHeart', 'pinkheart2', true);
register('stars', 'stars', true);
register('hammer', 'hammer_gif', true);
register('ping', 'ping', true);
register('stats', 'donutstats', true);
register('clock', 'clock', true);
register('bell', 'bell', false);
register('lock', 'tc_lock', false);

// Hardware & Tech (STATIC)
register('cpu', 'cpu', false);
register('ram', 'ram', false);
register('disk', 'disk', false);
register('bandwidth', 'bandwith55', false);
register('backup', 'backup', false);
register('server', 'server', false);
register('vps', 'vps', false);
register('intel', 'intel', false);
register('amd', 'amd', false);
register('shield', 'shield', false);
register('support', 'support', false);
register('pc', 'pc', false);
register('offer', 'offer', false);
register('link', 'link', false);
register('coal', 'coal', false);
register('copper', 'copper', false);
register('iron', 'iron', false);
register('gold', 'gold_block', false);
register('emerald', 'emerald_nitro_tier', false);
register('enderman', 'minecraft_enderman_pixel_art', false);
register('gpay', 'gpay', false);
register('paypal', 'paypal', false);
register('jazzcash', 'jazzcash', false);
register('processor', 'ateex_processor', false);

module.exports = { E, B, getEmoji };
