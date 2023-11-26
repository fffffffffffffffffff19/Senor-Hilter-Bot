const { SlashCommandBuilder } = require('discord.js');
const { anySong, autoplayEmbed } = require('./config/response');
const distube = require('../../handlers/distube');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Auto play songs with the same gender'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: anySong, ephemeral: true });

        const autoplay = queue.toggleAutoplay();

        await interaction.reply({ embeds: [autoplayEmbed(autoplay)] });
    },
};
