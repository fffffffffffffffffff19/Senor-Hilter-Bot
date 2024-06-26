const { SlashCommandBuilder } = require('discord.js');
const { noQueue, needVoiceChannel } = require('./config/response');
const { distube } = require('../../main');
const { createLogger, fileName } = require('../../tools/logger');
const { guildMapGet } = require('../../class/guildTemplate');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Auto play songs with the same gender'),
    async execute(interaction) {
        try {
            const gTemplate = guildMapGet(interaction.guild.id);
            const queue = distube.getQueue(interaction);

            if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });
            if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });

            const autoplay = queue.toggleAutoplay();

            if (autoplay) gTemplate.autoplay = true;
            else gTemplate.autoplay = false;

            await interaction.deferReply('1');
            await interaction.deleteReply();

            queue.emit('autoplay', queue);
        } catch (erro) { createLogger.error(fileName, erro); }
    },
};
