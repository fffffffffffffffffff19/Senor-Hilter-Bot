const { SlashCommandBuilder } = require('discord.js');
const { shuffled, noQueue, needVoiceChannel } = require('./config/response');
const { createLogger, fileName } = require('../../tools/logger');
const { distube } = require('../../main');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle current queue.'),
    async execute(interaction) {
        try {
            const queue = distube.getQueue(interaction);

            if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });
            if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });

            await interaction.reply({ content: shuffled, ephemeral: true });

            await queue.shuffle();
        } catch (erro) { createLogger.error(fileName, erro); }
    },
};
