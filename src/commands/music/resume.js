const { SlashCommandBuilder } = require('discord.js');
const { noQueue, notPaused, needVoiceChannel } = require('./config/response');
const { distube } = require('../../main');
const { guildMapGet } = require('../../class/guildTemplate');
const { createLogger, fileName } = require('../../tools/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the current paused song'),
    async execute(interaction) {
        try {
            const gTemplate = guildMapGet(interaction.guild.id);
            const queue = distube.getQueue(interaction);

            if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });
            if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });
            if (!queue.paused) return interaction.reply({ content: notPaused, ephemeral: true });

            await interaction.deferReply('1');
            await interaction.deleteReply();

            queue.resume();

            gTemplate.paused = false;

            queue.emit('paused', queue);
        } catch (erro) { createLogger.error(fileName, erro); }
    },
};
