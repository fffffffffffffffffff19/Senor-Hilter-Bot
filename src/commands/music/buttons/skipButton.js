const { noQueue, needVoiceChannel, noQueueToSkip } = require('../config/response');
const distube = require('../../../../distube');
const client = require('../../../../app');

module.exports = {
    id: 'skipButton',
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });
        if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });
        if (queue.songs.length === 1 && client.autoplay === false) return interaction.reply({ content: noQueueToSkip, ephemeral: true });

        client.skipManual = true;

        await interaction.deferUpdate();
        await queue.skip();
    },
};
