const { SlashCommandBuilder } = require('discord.js');
const distube = require('../../handlers/distube');
const { noQueue, songPaused, hasPaused } = require('./config/response');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause current song'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });

        if (queue.paused) {
            queue.resume();
            return interaction.reply({ content: hasPaused, ephemeral: true });
        }

        queue.pause();
        await interaction.reply({ content: songPaused, ephemeral: true });
    },
};
