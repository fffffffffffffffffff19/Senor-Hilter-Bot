const { linkNotSuported } = require('../config/response');
const { distube } = require('../../../main');
const { createLogger, fileName } = require('../../../tools/logger');

module.exports = async (interaction, channel, userRequest, member, skip) => {
    try {
        await interaction.deferReply('1');
        await interaction.deleteReply();

        if (!skip) await distube.play(channel, userRequest, { member, textChannel: interaction.channel });
        else await distube.play(channel, userRequest, { member, textChannel: interaction.channel, skip: true });
    } catch (erro) {
        await createLogger.error(fileName, erro);
        return interaction.reply({ content: linkNotSuported, ephemeral: true });
    }
};
