const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');
const { guildUpdate } = require('../../class/guildTemplate');
const { disableAutoplay } = require('../../assets/txt/response');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder().setName('repeat').setDescription('Set to repeat mode'),
    async execute(interaction) {
        // getting player queue and any error
        const { queue, error, guildId } = await commandErrorHandler(interaction);
        // checking if has any error
        if (error) return;
        // checking if repeat mode is enabled
        if (queue.repeatMode === QueueRepeatMode.AUTOPLAY) {
            return interaction.reply({ content: disableAutoplay, flags: MessageFlags.Ephemeral });
        }
        // checking if Repeat mode is on or off
        if (queue.repeatMode === QueueRepeatMode.TRACK) {
            queue.setRepeatMode(QueueRepeatMode.OFF);
            await guildUpdate({ guildId: guildId, repeatMode: false });
        } else {
            queue.setRepeatMode(QueueRepeatMode.TRACK);
            await guildUpdate({ guildId: guildId, repeatMode: true });
        }
        // emiting new event
        queue.emit('repeatMode', queue);
        // replying interaction
        await interaction.deferReply();
        await interaction.deleteReply();
    },
};
