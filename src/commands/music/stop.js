const { SlashCommandBuilder } = require('discord.js');
const { guildUpdate } = require('../../class/guildTemplate');
const { resetPlayerPanel } = require('../../audio/playerPanel');
const { stop } = require('../../audio/controls');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder().setName('stop').setDescription('Stop playback and leave the voice channel'),
    async execute(interaction) {
        const { player, guildId, error } = await commandErrorHandler(interaction);
        if (error) return;

        await guildUpdate({ guildId, autoplay: false, paused: false, repeatMode: false });
        await stop(player);
        await resetPlayerPanel(interaction.client, guildId);
        await interaction.deferReply();
        await interaction.deleteReply();
    },
};
