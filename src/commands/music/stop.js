const { SlashCommandBuilder } = require('discord.js');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder().setName('stop').setDescription('Stop the current qeue'),
    async execute(interaction) {
        // getting guildId, player queue and any error
        const { queue, error } = await commandErrorHandler(interaction);
        // returning if have any error
        if (error) return;
        // stopping current queue and emiting a new bot event
        queue.emit('emptyQueue', queue);
        // replying interaction and deleting then
        await interaction.deferReply();
        await interaction.deleteReply();
    },
};
