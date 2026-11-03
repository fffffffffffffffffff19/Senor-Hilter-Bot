const { guildUpdate } = require('../../class/guildTemplate');
const { resetPlayerPanel } = require('../../audio/playerPanel');
const { stop } = require('../../audio/controls');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    id: 'stopButton',
    async execute(interaction) {
        const { player, guildId, error } = await commandErrorHandler(interaction);
        if (error) return;

        await guildUpdate({ guildId, autoplay: false, paused: false, repeatMode: false });
        await stop(player);
        await resetPlayerPanel(interaction.client, guildId);
        await interaction.deferUpdate();
    },
};
