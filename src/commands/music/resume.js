const { SlashCommandBuilder } = require('discord.js');
const { noQueue, notPaused } = require('./config/response');
const distube = require('../../../distube');
const client = require('../../../app');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the current paused song'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });
        if (!queue.paused) return interaction.reply({ content: notPaused, ephemeral: true });

        await interaction.deferReply('1');
        await interaction.deleteReply();

        queue.resume();
        client.paused = false;
        queue.emit('paused', queue);
    },
};
