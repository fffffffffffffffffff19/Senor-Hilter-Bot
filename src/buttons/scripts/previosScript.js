const { MessageFlags } = require('discord.js');
const { playPrevious } = require('../../audio/controls');
const { noPreviousSong } = require('../../assets/txt/response');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    id: 'previosButton',
    async execute(interaction) {
        const { player, error } = await commandErrorHandler(interaction);
        if (error) return;

        if (!(await playPrevious(player))) {
            return interaction.reply({ content: noPreviousSong, flags: MessageFlags.Ephemeral });
        }

        await interaction.deferUpdate();
    },
};
