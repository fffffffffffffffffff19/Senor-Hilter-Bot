const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('response')
        .setDescription('api command [DEV]'),
    async execute(interaction) {
        await interaction.reply({ content: 'In development..', flags: [MessageFlags.Ephemeral] });
    },
};
