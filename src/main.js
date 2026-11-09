const { Client, GatewayIntentBits } = require('discord.js');
const LavalinkManager = require('./audio/lavalinkManager');
const clientConfig = require('../config');

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

const lavalink = new LavalinkManager(client, {
    host: process.env.LAVALINK_HOST || '127.0.0.1',
    port: Number(process.env.LAVALINK_PORT || 2333),
    password: process.env.LAVALINK_PASSWORD,
    secure: process.env.LAVALINK_SECURE === 'true',
    username: clientConfig.clientUsername,
    clientId: process.env.CLIENT_ID,
});

client.lavalink = lavalink;

module.exports = { client, lavalink };
