const { noQueue, needVoiceChannel } = require('../config/response');
const distube = require('../../../../distube');

module.exports = {
    id: 'stopButton',
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });
        if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });

        await interaction.deferUpdate();

        await queue.stop();
    },
};
