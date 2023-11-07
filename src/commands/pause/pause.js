const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('pause song'),
    async execute(interaction) {
        await interaction.reply('teste');
    },
};
