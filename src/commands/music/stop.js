const { SlashCommandBuilder } = require('discord.js');
const { noQueue, needVoiceChannel } = require('./config/response');
const distube = require('../../../distube');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the current qeue'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });
        if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });

        await interaction.deferReply('1');
        await interaction.deleteReply();

        await queue.stop();
    },
};
