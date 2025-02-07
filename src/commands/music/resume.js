const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { guildUpdate } = require('../../class/guildTemplate');
const { notPaused } = require('../../assets/txt/response');
const { useTimeline } = require('discord-player');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder().setName('resume').setDescription('Resume the current paused song'),
    async execute(interaction) {
        // getting guildId, player queue and any error
        const { guildId, queue, error } = await commandErrorHandler(interaction);
        // returning if have any error
        if (error) return;
        // geting the timeLine instance from the guildId
        const timeLine = useTimeline({ node: guildId });
        // check if has paused
        if (!timeLine.paused) return interaction.reply({ content: notPaused, flags: MessageFlags.Ephemeral });
        // updating the guild config on db
        await guildUpdate({ guildId: guildId, paused: false });
        // resuming the song and emiting a new bot
        timeLine.resume();
        queue.emit('paused', queue);
        // replying interaction and delete then
        await interaction.deferReply();
        await interaction.deleteReply();
    },
};
