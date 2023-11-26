const { SlashCommandBuilder } = require('discord.js');
const { stopEmbed, noQueue } = require('./config/response');
const distube = require('../../handlers/distube');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the current qeue'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: noQueue });

        await queue.stop();

        await interaction.reply({ embeds: [stopEmbed] });
    },
};
