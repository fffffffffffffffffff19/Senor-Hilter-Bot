const { MessageFlags } = require('discord.js');
const { lavalink } = require('../main');
const { guildFetch } = require('../class/guildTemplate');
const { needVoiceChannel, noQueue, noGuildOnDB } = require('../assets/txt/response');

module.exports = async (interaction, playCommand = false) => {
    const replyWithError = async (content) => {
        await interaction.reply({ content, flags: MessageFlags.Ephemeral });
        return { error: true };
    };

    const { guild, guildId } = interaction;
    if (!guild || !guildId) {
        return replyWithError('This command can only be used in a server.');
    }

    if (!(await guildFetch(guildId))) {
        return replyWithError(noGuildOnDB);
    }

    const member = await guild.members.fetch(interaction.user.id);
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
        return replyWithError(needVoiceChannel);
    }

    const player = lavalink.getPlayer(guildId);
    if (playCommand) {
        return { guildId, voiceChannel, member, player, error: false };
    }

    if (!player || !player.queue.current) {
        return replyWithError(noQueue);
    }

    return { guildId, voiceChannel, member, player, error: false };
};
