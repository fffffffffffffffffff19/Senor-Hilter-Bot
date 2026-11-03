const { MessageFlags } = require('discord.js');
const { toggleAutoplay } = require('../../audio/controls');
const { sendTemporaryNotice } = require('../../audio/playerPanel');
const autoplayEmbed = require('../../assets/embeds/autoplayEmbed');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    id: 'autoplayButton',
    async execute(interaction) {
        const { player, guildId, error } = await commandErrorHandler(interaction);
        if (error) return;

        const result = await toggleAutoplay(player, guildId);
        if (result.error) {
            return interaction.reply({ content: result.error, flags: MessageFlags.Ephemeral });
        }

        await interaction.deferUpdate();
        await sendTemporaryNotice(interaction.client, guildId, {
            embeds: [await autoplayEmbed(result.enabled)],
        });
    },
};
