const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        await client.user.setActivity('/help for all commands', ActivityType.Playing);
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
