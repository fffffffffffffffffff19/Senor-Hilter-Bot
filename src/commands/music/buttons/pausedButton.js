const { noQueue, needVoiceChannel } = require('../config/response');
const distube = require('../../../../distube');
const client = require('../../../../app');

module.exports = {
    id: 'pausedButton',
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });
        if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });

        await interaction.deferUpdate();

        if (client.paused) {
            queue.resume();
            client.paused = false;
            queue.emit('paused', queue);
        } else {
            queue.pause();
            client.paused = true;
            queue.emit('paused', queue);
        }
    },
};
