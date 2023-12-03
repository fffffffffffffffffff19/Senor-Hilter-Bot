const { shuffled, noQueue, needVoiceChannel } = require('../config/response');
const distube = require('../../../../distube');

module.exports = {
    id: 'shuffleButton',
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });
        if (!queue) return interaction.send({ content: noQueue, ephemeral: true });

        await interaction.reply({ content: shuffled, ephemeral: true });

        await queue.shuffle();
    },
};
