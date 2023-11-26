const { SlashCommandBuilder } = require('discord.js');
const { noQueue, notPaused, songResume } = require('./config/response');
const distube = require('../../handlers/distube');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the current paused song'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });
        if (!queue.paused) return interaction.reply({ content: notPaused, ephemeral: true });

        queue.resume();
        await interaction.reply({ content: songResume, ephemeral: true });
    },
};
