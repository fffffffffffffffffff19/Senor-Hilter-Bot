const { SlashCommandBuilder } = require('discord.js');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder().setName('repeat').setDescription('Set to repeat mode'),
    async execute(interaction) {
        // getting player queue and any error
        const { queue, error } = await commandErrorHandler(interaction);
        // returning if have any error
        if (error) return;
        // enabling repeat mode or disabling
        queue.repeatMode === 1 ? queue.setRepeatMode(0) : queue.setRepeatMode(1);
        // replying interaction and deleting then
        await interaction.deferReply();
        await interaction.deleteReply();
    },
};
