const { shuffled, noQueue, needVoiceChannel } = require('../config/response');
const { distube } = require('../../../main');
const { createLogger, fileName } = require('../../../tools/logger');

module.exports = {
    id: 'shuffleButton',
    async execute(interaction) {
        try {
            const queue = distube.getQueue(interaction);

            if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });
            if (!queue) return interaction.send({ content: noQueue, ephemeral: true });

            await interaction.reply({ content: shuffled, ephemeral: true });

            await queue.shuffle();
        } catch (erro) { createLogger.error(fileName, erro); }
    },
};
