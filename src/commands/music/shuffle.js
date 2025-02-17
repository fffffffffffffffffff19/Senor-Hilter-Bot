const { SlashCommandBuilder } = require('discord.js');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder().setName('shuffle').setDescription('Shuffle current queue.'),
    async execute(interaction) {
        // getting guildId, player queue and any error
        const { queue, error } = await commandErrorHandler(interaction);
        // returning if have any error
        if (error) return;
        // shuffling the current queue
        queue.tracks.shuffle();
        // emiting a new event
        queue.emit('shuffled', queue);
        // replying interaction and deleting then
        await interaction.deferReply();
        await interaction.deleteReply();
    },
};
