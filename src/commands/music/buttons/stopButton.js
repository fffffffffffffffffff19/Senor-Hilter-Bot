const { noQueue, needVoiceChannel } = require('../config/response');
const { distube } = require('../../../main');
const { guildMapGet } = require('../../../class/guildTemplate');
const { createLogger, fileName } = require('../../../tools/logger');

module.exports = {
    id: 'stopButton',
    async execute(interaction) {
        try {
            const gTemplate = guildMapGet(interaction.guild.id);
            const queue = distube.getQueue(interaction);

            if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });
            if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });

            gTemplate.stop = true;

            await queue.stop();
            await interaction.deferUpdate();
        } catch (erro) { createLogger.error(fileName, erro); }
    },
};
