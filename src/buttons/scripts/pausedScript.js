const { guildUpdate } = require('../../class/guildTemplate');
const { togglePause } = require('../../audio/controls');
const pausedEmbed = require('../../assets/embeds/pausedEmbed');
const { sendTemporaryNotice } = require('../../audio/playerPanel');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    id: 'pausedButton',
    async execute(interaction) {
        const { guildId, player, error } = await commandErrorHandler(interaction);
        if (error) return;

        const paused = await togglePause(player);
        await guildUpdate({ guildId, paused });
        await interaction.deferUpdate();
        await sendTemporaryNotice(interaction.client, guildId, {
            embeds: [await pausedEmbed(paused)],
        });
    },
};
