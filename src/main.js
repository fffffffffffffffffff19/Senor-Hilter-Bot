const { Client, GatewayIntentBits } = require('discord.js');
const { LavalinkManager } = require('lavalink-client');
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

const lavalink = new LavalinkManager({
    nodes: [
        {
            id: 'primary',
            host: process.env.LAVALINK_HOST || '127.0.0.1',
            port: Number(process.env.LAVALINK_PORT || 2333),
            authorization: process.env.LAVALINK_PASSWORD,
            secure: process.env.LAVALINK_SECURE === 'true',
        },
    ],
    sendToShard: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) return guild.shard.send(payload);
    },
    autoSkip: true,
    linksBlacklist: [
        /^https?:\/\/(?:[^/?#@]+@)?(?:localhost\.?|[^./:?#]+)(?::\d+)?(?:[/?#]|$)/i,
        /^https?:\/\/(?:[^/?#@]+@)?(?:[a-z0-9-]+\.)*(?:localhost|local|internal|lan|home|home\.arpa)\.?(?::\d+)?(?:[/?#]|$)/i,
        /^https?:\/\/(?:[^/?#@]+@)?(?:\[[^\]]+\]|(?:\d{1,3}\.){3}\d{1,3}|0x[0-9a-f]+|\d+)(?::\d+)?(?:[/?#]|$)/i,
    ],
    client: {
        id: process.env.CLIENT_ID,
        username: clientConfig.clientUsername,
    },
    playerOptions: {
        defaultSearchPlatform: 'ytsearch',
        onDisconnect: {
            autoReconnect: true,
            autoReconnectOnlyWithTracks: true,
        },
    },
});

client.lavalink = lavalink;

module.exports = { client, lavalink };
