const { noQueue, needVoiceChannel, noQueueToSkip, needResume } = require('../config/response');
const { distube } = require('../../../main');
const { guildMapGet } = require('../../../class/guildTemplate');
const { createLogger, fileName } = require('../../../tools/logger');

module.exports = {
    id: 'skipButton',
    async execute(interaction) {
        try {
            const guildConfig = guildMapGet(interaction.guild.id);
            const queue = distube.getQueue(interaction);

            if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });
            if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });
            if (queue.songs.length === 1 && guildConfig.autoplay === false) return interaction.reply({ content: noQueueToSkip, ephemeral: true });
            if (queue.paused) return interaction.reply({ content: needResume, ephemeral: true });

            await interaction.deferUpdate();
            await queue.skip();

            guildConfig.skipManual = true;
        } catch (erro) { createLogger.error(fileName, erro); }
    },
};
