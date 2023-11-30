const { Client, GatewayIntentBits } = require('discord.js');
const { FileExplorer } = require('./src/tools/fileExplorer');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

module.exports = client;

FileExplorer.findHandlers().forEach((handler) => require(handler)(client));

client.login(process.env.TOKEN);
