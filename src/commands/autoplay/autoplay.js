const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const distube = require('../../handlers/distube');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Auto play songs with the same gender'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: 'Any song on queue.' });

        const autoplay = queue.toggleAutoplay();

        const embed = new EmbedBuilder()
            .setDescription(`Autoplay is ${autoplay ? 'On' : 'Off'}`)
            .setColor(`${autoplay ? '#0aff00' : '#ff0000'}`)
            .setTimestamp(new Date().getTime());

        await interaction.reply({ embeds: [embed] });
    },
};
