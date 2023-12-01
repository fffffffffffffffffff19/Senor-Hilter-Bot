const { noQueue, needVoiceChannel } = require('../config/response');
const distube = require('../../../../distube');
const client = require('../../../../app');

module.exports = {
    id: 'autoplayButton',
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });
        if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });

        const autoplay = queue.toggleAutoplay();

        if (autoplay) client.autoplay = true;
        else client.autoplay = false;

        queue.emit('autoplay', queue);
        await interaction.deferUpdate();
    },
};
