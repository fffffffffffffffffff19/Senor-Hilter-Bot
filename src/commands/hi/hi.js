const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hi')
        .setDescription(':v'),
    async execute(interaction) {
        await interaction.reply({ content: 'Hellooo', ephemeral: true });
        // console.log(interaction);
    },
};
