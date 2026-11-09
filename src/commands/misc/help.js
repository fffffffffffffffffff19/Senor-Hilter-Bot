const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { helpEmbed } = require('../../assets/txt/response');

module.exports = {
    data: new SlashCommandBuilder().setName('help').setDescription('My command list'),
    async execute(interaction) {
        // send embed with all commands
        await interaction.reply({ embeds: [helpEmbed], flags: [MessageFlags.Ephemeral] });
    },
};
