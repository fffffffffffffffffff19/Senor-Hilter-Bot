const { SlashCommandBuilder } = require('discord.js');
const distube = require('../../../distube');
const { hasPaused, noQueue, needVoiceChannel } = require('./config/response');
const client = require('../../../app');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause current song'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });
        if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });

        if (queue.paused) {
            queue.resume();
            return interaction.reply({ content: hasPaused, ephemeral: true });
        }

        await interaction.deferReply('1');
        await interaction.deleteReply();

        queue.pause();
        client.paused = true;
        queue.emit('paused', queue);
    },
};
