const { noQueue, needVoiceChannel } = require('../config/response');
const { distube } = require('../../../main');
const { guildMapGet } = require('../../../class/guildTemplate');
const { createLogger, fileName } = require('../../../tools/logger');

module.exports = {
    id: 'pausedButton',
    async execute(interaction) {
        try {
            const guildConfig = guildMapGet(interaction.guild.id);
            const queue = distube.getQueue(interaction);

            if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });
            if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });

            await interaction.deferUpdate();

            if (guildConfig.paused) {
                queue.resume();
                guildConfig.paused = false;
                queue.emit('paused', queue);
            } else {
                queue.pause();
                guildConfig.paused = true;
                queue.emit('paused', queue);
            }
        } catch (erro) { createLogger.error(fileName, erro); }
    },
};
