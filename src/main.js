const { Client, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-player');

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
    }
}

module.exports = new SenorHilter();
