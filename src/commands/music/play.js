const { SlashCommandBuilder } = require('discord.js');
const { addSong } = require('../../class/playClass');
const { createLogger, fileName } = require('../../tools/logger');
const { guildMapFetch, guildMapCreate, guildMapGet } = require('../../class/guildTemplate');
const { needVoiceChannel } = require('./config/response');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Add and Play musics')
        .addStringOption((option) => option
            .setName('music')
            .setDescription('Send the music link or name to play.')
            .setRequired(true)),
    async execute(interaction) {
        try {
            const member = interaction.guild.members.cache.get(interaction.member.id);
            const userChannel = member.voice.channel;

            if (!userChannel) return interaction.reply({ content: needVoiceChannel, ephemeral: true });

            if (!guildMapFetch(interaction.guild.id)) guildMapCreate(interaction.guild.id);

            const guildConfig = guildMapGet(interaction.guild.id);

            if (guildConfig.stop) guildConfig.stop = false;

            const userRequest = await interaction.options.getString('music');

            await addSong(interaction, userChannel, userRequest, member, false);
        } catch (erro) { createLogger.error(fileName, erro); }
    },
};
