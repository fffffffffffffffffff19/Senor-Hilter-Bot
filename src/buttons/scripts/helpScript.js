const { MessageFlags } = require('discord.js');
const helpEmbed = require('../../assets/embeds/helpEmbed');

module.exports = {
    id: 'helpButton',
    async execute(buttonInteraction) {
        return buttonInteraction.reply({ embeds: [helpEmbed], flags: MessageFlags.Ephemeral });
    },
};
