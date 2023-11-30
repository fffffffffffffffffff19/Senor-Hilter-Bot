const { SlashCommandBuilder } = require('discord.js');
const { anySong } = require('./config/response');
const distube = require('../../../distube');
const client = require('../../../app');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Auto play songs with the same gender'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: anySong, ephemeral: true });

        const autoplay = queue.toggleAutoplay();

        if (autoplay) client.autoplay = true;
        else client.autoplay = false;

        await interaction.deferReply('1');
        await interaction.deleteReply();

        queue.emit('autoplay', queue);
    },
};
