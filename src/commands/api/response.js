const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('response')
        .setDescription('api command [DEV]'),
    async execute(interaction) {
        await interaction.reply({ content: 'In development..', ephemeral: true });
    },
};
