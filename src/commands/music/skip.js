const { SlashCommandBuilder } = require('discord.js');
const { noQueue, noQueueToSkip, needVoiceChannel } = require('./config/response');
const distube = require('../../../distube');
const client = require('../../../app');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current song.'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);
        if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });
        if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });
        if (queue.songs.length === 1) return interaction.reply({ content: noQueueToSkip, ephemeral: true });

        client.skipManual = true;

        await queue.skip();

        await interaction.deferReply('1');
        await interaction.deleteReply();
    },
};
