const { Player } = require('discord-player');
const { Client, GatewayIntentBits } = require('discord.js');
const { YoutubeiExtractor } = require('discord-player-youtubei');
const { SpotifyExtractor, SoundCloudExtractor, AttachmentExtractor } = require('@discord-player/extractor');

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

        this.player = new Player(this.client);
        this.extractorRegister = this.player.extractors.loadMulti([
            SpotifyExtractor,
            YoutubeiExtractor,
            SoundCloudExtractor,
            AttachmentExtractor,
        ]);
    }
}

module.exports = new SenorHilter();
