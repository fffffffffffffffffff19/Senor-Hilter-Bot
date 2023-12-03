const { noQueue, needVoiceChannel } = require('../config/response');
const distube = require('../../../../distube');
const client = require('../../../../app');

module.exports = {
    id: 'stopButton',
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });
        if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });

        client.stop = true;

        await queue.stop();
        await interaction.deferUpdate();
    },
};
