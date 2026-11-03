const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { guildUpdate } = require('../../class/guildTemplate');
const pausedEmbed = require('../../assets/embeds/pausedEmbed');
const { sendTemporaryNotice } = require('../../audio/playerPanel');
const { hasPaused } = require('../../assets/txt/response');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder().setName('pause').setDescription('Pause current song'),
    async execute(interaction) {
        const { guildId, player, error } = await commandErrorHandler(interaction);
        if (error) return;
        if (player.paused) {
            return interaction.reply({ content: hasPaused, flags: MessageFlags.Ephemeral });
        }

        await player.pause();
        await guildUpdate({ guildId, paused: true });
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        await sendTemporaryNotice(interaction.client, guildId, {
            embeds: [await pausedEmbed(true)],
        });
        await interaction.deleteReply();
    },
};
