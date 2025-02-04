const { SlashCommandBuilder } = require('discord.js');
const { guildUpdate } = require('../../class/guildTemplate');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder().setName('pause').setDescription('Pause current song'),
    async execute(interaction) {
        // getting guildId, player queue and any error
        const { guildId, queue, error } = await commandErrorHandler(interaction);
        // returning if have any error
        if (error) return;
        // updating the guild config on db
        await guildUpdate({ guildId: guildId, paused: true });
        // pausing current queue and emiting a new bot event
        queue.pause();
        queue.emit('paused', queue);
        // replying interaction and deleting then
        await interaction.deferReply();
        await interaction.deleteReply();
    },
};
