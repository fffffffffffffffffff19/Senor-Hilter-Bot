const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');
const { guildUpdate } = require('../../class/guildTemplate');
const { disableRepeatMode } = require('../../assets/txt/response');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder().setName('autoplay').setDescription('Auto play songs with the same gender'),
    async execute(interaction) {
        // getting guildId, player queue and any error
        const { queue, error, guildId } = await commandErrorHandler(interaction);
        // checking if has any error
        if (error) return;
        // checking if repeat mode is enabled
        if (queue.repeatMode === QueueRepeatMode.TRACK) {
            return interaction.reply({ content: disableRepeatMode, flags: MessageFlags.Ephemeral });
        }
        // checking if autoplay is on or off
        if (queue.repeatMode === QueueRepeatMode.AUTOPLAY) {
            queue.setRepeatMode(QueueRepeatMode.OFF);
            await guildUpdate({ guildId: guildId, autoplay: false });
        } else {
            queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
            await guildUpdate({ guildId: guildId, autoplay: true });
        }
        // emiting new event
        queue.emit('autoplay', queue);
        // replying interaction
        await interaction.deferReply();
        await interaction.deleteReply();
    },
};
