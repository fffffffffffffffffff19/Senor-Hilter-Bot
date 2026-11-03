const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { lavalink } = require('../../main');
const { guildGet } = require('../../class/guildTemplate');
const { createLogger, fileName } = require('../../class/logger');
const commandErrorHandler = require('../../func/commandErrorHandler');
const { noSongSearch } = require('../../assets/txt/response');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Add music from a search, URL, or uploaded audio file')
        .addStringOption((option) =>
            option.setName('music').setDescription('Search term or audio URL').setRequired(false),
        )
        .addAttachmentOption((option) =>
            option.setName('file').setDescription('Audio file to play').setRequired(false),
        ),
    async execute(interaction) {
        const { guildId, voiceChannel, error } = await commandErrorHandler(interaction, true);
        if (error) return;

        const guildConfig = await guildGet(guildId);
        const searchQuery = interaction.options.getString('music');
        const audioFile = interaction.options.getAttachment('file');
        if (Boolean(searchQuery) === Boolean(audioFile)) {
            return interaction.reply({
                content: 'Provide either a search term/URL or one audio file.',
                flags: MessageFlags.Ephemeral,
            });
        }

        const query = audioFile?.url || searchQuery;
        const existingPlayer = lavalink.getPlayer(guildId);
        let player = existingPlayer;

        try {
            if (player && player.voiceChannelId !== voiceChannel.id && player.playing) {
                return interaction.reply({
                    content: 'I am already playing in a different voice channel.',
                    flags: MessageFlags.Ephemeral,
                });
            }

            player = lavalink.createPlayer({
                guildId,
                voiceChannelId: voiceChannel.id,
                textChannelId: guildConfig.textChannel || interaction.channelId,
                selfDeaf: true,
                volume: 100,
            });

            if (player.voiceChannelId !== voiceChannel.id) {
                await player.changeVoiceState({ voiceChannelId: voiceChannel.id });
            }

            const result = await player.search({ query }, interaction.user);
            if (!result.tracks.length) {
                if (!existingPlayer) await player.destroy('empty search result');
                return interaction.reply({ content: noSongSearch, flags: MessageFlags.Ephemeral });
            }

            const tracksToAdd = result.playlist ? result.tracks : [result.tracks[0]];
            await player.queue.add(tracksToAdd);
            if (!player.connected) await player.connect();
            if (!player.playing && !player.paused) await player.play();

            const addedCount = tracksToAdd.length;
            await interaction.reply({
                content: `Added ${addedCount} track${addedCount === 1 ? '' : 's'} to the queue.`,
                flags: MessageFlags.Ephemeral,
            });
        } catch (error) {
            createLogger.error(fileName(__filename), error);
            if (!existingPlayer && player) {
                try {
                    await player.destroy('play request failed');
                } catch (cleanupError) {
                    createLogger.error(fileName(__filename), cleanupError);
                }
            }

            const reply = {
                content: 'The audio service could not process this request.',
                flags: MessageFlags.Ephemeral,
            };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(reply);
            } else {
                await interaction.reply(reply);
            }
        }
    },
};
