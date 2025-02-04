const { SlashCommandBuilder } = require('discord.js');
const { guildUpdate } = require('../../class/guildTemplate');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder().setName('resume').setDescription('Resume the current paused song'),
    async execute(interaction) {
        // getting guildId, player queue and any error
        const { guildId, queue, error } = await commandErrorHandler(interaction);
        // returning if have any error
        if (error) return;
        // updating the guild config on db
        await guildUpdate({ guildId: guildId, paused: false });
        // resuming the song and emiting a new bot
        queue.resume();
        queue.emit('paused', queue);
        // replying interaction and delete then
        await interaction.deferReply();
        await interaction.deleteReply();
    },
};
