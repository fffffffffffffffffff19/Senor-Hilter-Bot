const { SlashCommandBuilder } = require('discord.js');
const { guildUpdate } = require('../../class/guildTemplate');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder().setName('autoplay').setDescription('Auto play songs with the same gender'),
    async execute(interaction) {
        // getting guildId, player queue and any error
        const { guildId, queue, error } = await commandErrorHandler(interaction);
        // returning if have any error
        if (error) return;
        // toggle autoplay in queue
        const autoplay = queue.toggleAutoplay();
        // updating guild config on db
        await guildUpdate({ guildId: guildId, autoplay: autoplay });
        // emiting a new bot event
        queue.emit('autoplay', queue);
        // replying interaction and deleting then
        await interaction.deferReply();
        await interaction.deleteReply();
    },
};
