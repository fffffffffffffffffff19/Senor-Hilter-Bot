const { noQueue, needVoiceChannel } = require('../config/response');
const { distube } = require('../../../main');
const { guildMapGet } = require('../../../class/guildTemplate');
const { createLogger, fileName } = require('../../../tools/logger');

module.exports = {
    id: 'autoplayButton',
    async execute(interaction) {
        try {
            const gTemplate = guildMapGet(interaction.guild.id);
            const queue = distube.getQueue(interaction);

            if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });
            if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });

            const autoplay = queue.toggleAutoplay();

            if (autoplay) gTemplate.autoplay = true;
            else gTemplate.autoplay = false;

            queue.emit('autoplay', queue);
            await interaction.deferUpdate();
        } catch (erro) { createLogger.error(fileName, erro); }
    },
};
