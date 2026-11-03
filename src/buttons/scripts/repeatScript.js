const { MessageFlags } = require('discord.js');
const { toggleRepeat } = require('../../audio/controls');
const { sendTemporaryNotice } = require('../../audio/playerPanel');
const repeatModeEmbed = require('../../assets/embeds/repeatModeEmbed');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    id: 'repeatButton',
    async execute(interaction) {
        const { player, guildId, error } = await commandErrorHandler(interaction);
        if (error) return;

        const result = await toggleRepeat(player, guildId);
        if (result.error) {
            return interaction.reply({ content: result.error, flags: MessageFlags.Ephemeral });
        }

        await interaction.deferUpdate();
        await sendTemporaryNotice(interaction.client, guildId, {
            embeds: [await repeatModeEmbed(result.enabled)],
        });
    },
};
