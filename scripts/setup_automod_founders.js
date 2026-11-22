require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { 
  Client, 
  GatewayIntentBits, 
  AutoModerationRuleTriggerType, 
  AutoModerationRuleEventType, 
  AutoModerationActionType 
} = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const VICTUS_ID = '1188142147522805780';
const BASU_ID = '1508060248328376380';

const STAFF_ROLES = [
  '1573412727383392427', // Founder
  '1573412731644805140', // CEO
  '1573412734698004550', // COO
  '1573412738074550514', // Manager
  '1573412741031530506', // Developer
  '1573412746689515770', // Sysadmin
  '1573412749986365500', // Admin
  '1573412753073381477', // Head Mod
  '1573412756286214306', // Mod
  '1573412759532732567', // Support
  '1573412762586189844'  // Trial Staff
];

const ticketLogsChannelId = '1573780018834710548'; // # ⊘・ᴛɪᴄᴋᴇᴛ-ʟᴏɢꜱ

client.once('clientReady', async () => {
  const guild = await client.guilds.fetch('1573272872737181696');
  console.log(`Connected to guild: ${guild.name}`);

  // Check if an existing rule with this name exists
  const existingRules = await guild.autoModerationRules.fetch();
  const existing = existingRules.find(r => r.name.toLowerCase().includes('founder') || r.name.toLowerCase().includes('victus'));

  if (existing) {
    console.log(`Found existing rule "${existing.name}" (${existing.id}), updating...`);
    await existing.delete('Recreating with latest configuration');
  }

  try {
    const rule = await guild.autoModerationRules.create({
      name: 'Anti-Founder Ping (Victus & Basu)',
      eventType: AutoModerationRuleEventType.MessageSend,
      triggerType: AutoModerationRuleTriggerType.Keyword,
      triggerMetadata: {
        keywordFilter: [
          `*${VICTUS_ID}*`,
          `*${BASU_ID}*`
        ],
        regexPatterns: [
          `<@!?${VICTUS_ID}>`,
          `<@!?${BASU_ID}>`
        ]
      },
      actions: [
        {
          type: AutoModerationActionType.BlockMessage,
          metadata: {
            customMessage: 'Please do not ping the founders (Victus & Basu). If you need assistance, please open a ticket in #⊘・ᴄʀᴇᴀᴛᴇ-ᴛɪᴄᴋᴇᴛ!'
          }
        },
        {
          type: AutoModerationActionType.SendAlertMessage,
          metadata: {
            channel: ticketLogsChannelId
          }
        }
      ],
      enabled: true,
      exemptRoles: STAFF_ROLES,
      reason: 'Official AutoMod rule: Block unauthorized pings to Founders Victus & Basu'
    });

    console.log(`✓ Successfully created Discord Official AutoMod rule! ID: ${rule.id}`);
    console.log(`Rule Name: ${rule.name}`);
    console.log(`Actions: Block Message with Custom Explanation + Alert to Ticket Logs`);
    console.log(`Exempt Roles: ${STAFF_ROLES.length} staff roles`);
  } catch (err) {
    console.error('✗ Failed to create AutoMod rule:', err);
  }

  process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);
