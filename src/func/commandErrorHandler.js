const { MessageFlags } = require('discord.js');
const { guildFetch } = require('../class/guildTemplate');
const { needVoiceChannel, noQueue, noGuildOnDB } = require('../assets/txt/response');
const { useQueue } = require('discord-player');

module.exports = async (interaction, playCommand) => {
    // func to return certain conditions
    const errorChecker = async (conditional, newValue) => {
        if (conditional) {
            return interaction.reply({ content: newValue, flags: MessageFlags.Ephemeral }).then(() => {
                error = true;
            });
        }
    };

    let error;
    const member = await interaction.guild.members.cache.get(interaction.member.id);
    const voiceChannel = await member.voice.channel;
    const guildId = await interaction.guild.id;
    const queue = useQueue(guildId);
    // checking if guild as registed on db
    await errorChecker(!(await guildFetch(guildId)), noGuildOnDB);
    // checking if interaction.user are on client channel
    await errorChecker(!voiceChannel, needVoiceChannel);
    // returning if command runned is /play or /playskip
    if (playCommand) return { guildId, voiceChannel, member, error };
    // checking if exists any queue from this guild
    await errorChecker(!queue, noQueue);

    return { guildId, queue, voiceChannel, member, error };
};
