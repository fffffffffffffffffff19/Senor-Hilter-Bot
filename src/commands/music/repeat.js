const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { toggleRepeat } = require('../../audio/controls');
const repeatModeEmbed = require('../../assets/embeds/repeatModeEmbed');
const { sendTemporaryNotice } = require('../../audio/playerPanel');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder().setName('repeat').setDescription('Toggle repeat-current-track mode'),
    async execute(interaction) {
        const { player, guildId, error } = await commandErrorHandler(interaction);
        if (error) return;

        const result = await toggleRepeat(player, guildId);
        if (result.error) {
            return interaction.reply({ content: result.error, flags: MessageFlags.Ephemeral });
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        await sendTemporaryNotice(interaction.client, guildId, {
            embeds: [await repeatModeEmbed(result.enabled)],
        });
        await interaction.deleteReply();
    },
};
