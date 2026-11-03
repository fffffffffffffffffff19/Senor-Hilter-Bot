const { shuffle } = require('../../audio/controls');
const { sendTemporaryNotice } = require('../../audio/playerPanel');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    id: 'shuffleButton',
    async execute(interaction) {
        const { player, error } = await commandErrorHandler(interaction);
        if (error) return;

        await shuffle(player);
        await interaction.deferUpdate();
        await sendTemporaryNotice(interaction.client, interaction.guildId, {
            content: 'Queue shuffled.',
        });
    },
};
