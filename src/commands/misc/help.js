const { helpEmbed } = require('../../assets/txt/response');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('help').setDescription('My command list'),
    async execute(interaction) {
        // send embed with all commands
        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    },
};
