const { SlashCommandBuilder } = require('discord.js');
const { createLogger, fileName } = require('../../tools/logger');
const { guildMapFetch, guildMapCreate, guildMapGet } = require('../../class/guildTemplate');
const { needVoiceChannel } = require('./config/response');
const addSong = require('./exports/playFunction');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playskip')
        .setDescription('Add a song and Skip to it')
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

            await addSong(interaction, userChannel, userRequest, member, true);
        } catch (erro) { createLogger.error(fileName, erro); }
    },
};