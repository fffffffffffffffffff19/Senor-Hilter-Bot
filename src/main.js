const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { DeezerPlugin } = require('@distube/deezer');
const { leaveOnEmpty, leaveOnFinish, leaveOnStop } = require('../config').distubeConfig;

// main class for bot client/distube
class SenorHilter {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.GuildVoiceStates,
            ],
        });

        this.distube = new DisTube(this.client, {
            leaveOnFinish,
            leaveOnEmpty,
            leaveOnStop,
            emitNewSongOnly: false,
            savePreviousSongs: true,
            searchSongs: 0,
            plugins: [
                new SpotifyPlugin(),
                new SoundCloudPlugin(),
                new DeezerPlugin(),
            ],
        });
    }
}

module.exports = new SenorHilter();
