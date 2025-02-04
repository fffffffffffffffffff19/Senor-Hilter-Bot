const { DisTube } = require('distube');
const { Client, GatewayIntentBits } = require('discord.js');
const { SpotifyPlugin } = require('@distube/spotify');
const { YouTubePlugin } = require('@distube/youtube')
// const { cookie } = require('../config');

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
            emitNewSongOnly: false,
            savePreviousSongs: true,
            nsfw: true,
            plugins: [
                new SpotifyPlugin(),
                new YouTubePlugin(),
            ],
        });
    }
}

module.exports = new SenorHilter();
