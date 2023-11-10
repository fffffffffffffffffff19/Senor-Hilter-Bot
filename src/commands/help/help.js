const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('My command list'),
    async execute(interaction) {
        await interaction.reply({ content: 'farei ainda' });
    },
};
