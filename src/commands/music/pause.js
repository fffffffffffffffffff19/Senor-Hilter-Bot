const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { guildUpdate } = require('../../class/guildTemplate');
const { hasPaused } = require('../../assets/txt/response');
const { useTimeline } = require('discord-player');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder().setName('pause').setDescription('Pause current song'),
    async execute(interaction) {
        // getting guildId, player queue and any error
        const { guildId, queue, error } = await commandErrorHandler(interaction);
        // returning if have any error
        if (error) return;
        // geting the timeLine instance from the guildId
        const timeLine = useTimeline({ node: guildId });
        // check if has paused
        if (timeLine.paused) return interaction.reply({ content: hasPaused, flags: MessageFlags.Ephemeral });
        // updating the guild config on db
        await guildUpdate({ guildId: guildId, paused: true });
        // pausing current queue and emiting a new bot event
        timeLine.pause();
        queue.emit('paused', queue);
        // replying interaction and deleting then
        await interaction.deferReply();
        await interaction.deleteReply();
    },
};
