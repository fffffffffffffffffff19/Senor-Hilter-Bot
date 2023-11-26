const { SlashCommandBuilder } = require('discord.js');
const { helpEmbed } = require('./config/response');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('My command list'),
    async execute(interaction) {
        await interaction.reply({ embeds: [helpEmbed] });
    },
};
