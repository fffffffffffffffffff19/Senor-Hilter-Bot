const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { player } = require('../../main');
const { guildGet } = require('../../class/guildTemplate');
const { createLogger, fileName } = require('../../class/logger');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Add and Play musics')
        .addStringOption((option) => option.setName('music').setDescription('music link or name').setRequired(true)),
    //.addBooleanOption((option) => option.setName('skip').setDescription('skip to this music ?')),
    async execute(interaction) {
        // getting guild id, interaction voice channel, interaction member
        const { guildId, voiceChannel, error } = await commandErrorHandler(interaction, true);
        // returning if have any error
        if (error) return;
        // getting guild config, user song request and player text channel
        const guildConfig = await guildGet(guildId);
        const playerChannel = interaction.guild.channels.cache.get(guildConfig.textChannel);
        const userRequest = await interaction.options.getString('music');

        try {
            await player.play(voiceChannel, userRequest, {
                nodeOptions: {
                    leaveOnEmpty: true,
                    leaveOnEnd: false,
                    selfDeaf: true,
                    metadata: { channel: playerChannel },
                },
                requestedBy: interaction.user,
            });
        } catch (error) {
            await interaction.reply({
                content: 'A error occurred when trying to run this command.',
                flags: MessageFlags.Ephemeral,
            });
            createLogger.error(fileName, error);
        }
        // replying interaction and deleting then
        await interaction.deferReply();
        await interaction.deleteReply();
    },
};
