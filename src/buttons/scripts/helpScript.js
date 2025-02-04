const helpEmbed = require('../../assets/embeds/helpEmbed');

module.exports = {
    id: 'helpButton',
    async execute(buttonInteraction) {
        buttonInteraction.reply({ embeds: [helpEmbed], ephemeral: true });
    },
};
