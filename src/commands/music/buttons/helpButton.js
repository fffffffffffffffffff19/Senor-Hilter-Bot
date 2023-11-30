const { helpEmbed } = require('../config/response');

module.exports = {
    id: 'helpButton',
    async execute(interaction) {
        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    },
};
