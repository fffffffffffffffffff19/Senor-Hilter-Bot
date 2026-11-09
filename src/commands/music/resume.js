const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { guildUpdate } = require('../../class/guildTemplate');
const { sendTemporaryNotice } = require('../../audio/playerPanel');
const { notPaused } = require('../../assets/txt/response');
const pausedEmbed = require('../../assets/embeds/pausedEmbed');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder().setName('resume').setDescription('Resume the current paused song'),
    async execute(interaction) {
        const { guildId, player, error } = await commandErrorHandler(interaction);

        if (error) return;
        if (!player.paused) {
            return interaction.reply({ content: notPaused, flags: MessageFlags.Ephemeral });
        }

        await player.resume();
        await guildUpdate({ guildId, paused: false });
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        await sendTemporaryNotice(interaction.client, guildId, {
            embeds: [await pausedEmbed(false)],
        });
        await interaction.deleteReply();
    },
};
