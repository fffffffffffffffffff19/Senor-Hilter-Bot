const { SlashCommandBuilder } = require('discord.js');
const commandErrorHandler = require('../../func/commandErrorHandler');
const { QueueRepeatMode } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder().setName('repeat').setDescription('Set to repeat mode'),
    async execute(interaction) {
        // getting player queue and any error
        const { queue, error } = await commandErrorHandler(interaction);
        // returning if have any error
        if (error) return;
        // enabling repeat mode or disabling
        queue.repeatMode ? queue.setRepeatMode(QueueRepeatMode.OFF) : queue.setRepeatMode(QueueRepeatMode.TRACK);
        // replying interaction and deleting then
        await interaction.deferReply();
        await interaction.deleteReply();
    },
};
