const { SlashCommandBuilder } = require('discord.js');
const { noQueue, noQueueToSkip, needVoiceChannel, needResume } = require('./config/response');
const { distube } = require('../../main');
const { createLogger, fileName } = require('../../tools/logger');
const { guildMapGet } = require('../../class/guildTemplate');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current song.'),
    async execute(interaction) {
        try {
            const gTemplate = guildMapGet(interaction.guild.id);
            const queue = distube.getQueue(interaction);

            if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });
            if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });
            if (queue.songs.length === 1 && gTemplate.autoplay === false) return interaction.reply({ content: noQueueToSkip, ephemeral: true });
            if (queue.paused) return interaction.reply({ content: needResume, ephemeral: true });

            await queue.skip();

            await interaction.deferReply('1');
            await interaction.deleteReply();

            gTemplate.skipManual = true;
        } catch (erro) { createLogger.error(fileName, erro); }
    },
};
