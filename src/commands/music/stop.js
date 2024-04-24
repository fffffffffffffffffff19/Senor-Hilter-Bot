const { SlashCommandBuilder } = require('discord.js');
const { noQueue, needVoiceChannel } = require('./config/response');
const { distube } = require('../../main');
const { guildMapGet } = require('../../class/guildTemplate');
const { createLogger, fileName } = require('../../tools/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the current qeue'),
    async execute(interaction) {
        try {
            const guildConfig = guildMapGet(interaction.guild.id);
            const queue = distube.getQueue(interaction);

            if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });
            if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });

            guildConfig.stop = true;

            await queue.stop();
            await interaction.deferReply('1');
            await interaction.deleteReply();
        } catch (erro) { createLogger.error(fileName, erro); }
    },
};
