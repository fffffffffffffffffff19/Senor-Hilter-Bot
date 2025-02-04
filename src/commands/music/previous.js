const { SlashCommandBuilder } = require('discord.js');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder().setName('previous').setDescription('play the previous song'),
    async execute(interaction) {
        // getting guildId, player queue and any error
        const { queue, error } = await commandErrorHandler(interaction);
        // returning if have any error
        if (error) return;
        // playing the previous song
        queue.previous();
        // replying interaction and deleting then
        await interaction.deferReply();
        await interaction.deleteReply();
    },
};
