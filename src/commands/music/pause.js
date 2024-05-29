const { SlashCommandBuilder } = require('discord.js');
const { distube } = require('../../main');
const { hasPaused, noQueue, needVoiceChannel } = require('./config/response');
const { guildMapGet } = require('../../class/guildTemplate');
const { createLogger, fileName } = require('../../tools/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause current song'),
    async execute(interaction) {
        try {
            const gTemplate = guildMapGet(interaction.guild.id);
            const queue = distube.getQueue(interaction);

            if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });
            if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });

            if (queue.paused) {
                queue.resume();
                return interaction.reply({ content: hasPaused, ephemeral: true });
            }

            await interaction.deferReply('1');
            await interaction.deleteReply();

            gTemplate.paused = true;

            queue.pause();
            queue.emit('paused', queue);
        } catch (erro) { createLogger.error(fileName, erro); }
    },
};
