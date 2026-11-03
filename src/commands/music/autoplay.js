const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { toggleAutoplay } = require('../../audio/controls');
const { sendTemporaryNotice } = require('../../audio/playerPanel');
const autoplayEmbed = require('../../assets/embeds/autoplayEmbed');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Toggle best-effort similar-track autoplay'),
    async execute(interaction) {
        const { player, guildId, error } = await commandErrorHandler(interaction);
        if (error) return;

        const result = await toggleAutoplay(player, guildId);
        if (result.error) {
            return interaction.reply({ content: result.error, flags: MessageFlags.Ephemeral });
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        await sendTemporaryNotice(interaction.client, guildId, {
            embeds: [await autoplayEmbed(result.enabled)],
        });

        await interaction.deleteReply();
    },
};
