const { EmbedBuilder } = require('discord.js');
const trackDetails = require('../../audio/trackDetails');

module.exports = (track) => {
    const details = trackDetails(track);
    const description = details.url ? `[${details.title}](${details.url})` : details.title;
    const embed = new EmbedBuilder()
        .setAuthor({
            name: '⋮ Song Skiped ·',
        })
        .setDescription(description)
        .setColor('#00ffec')
        .setFooter({
            text: 'fffffffffffffffs • /help for all commands',
            iconURL: 'https://cdn3.emoji.gg/emojis/3551-music.gif',
        })
        .setTimestamp()
        .setImage('https://i.imgur.com/eiwgdXB.png');

    if (details.thumbnail) embed.setThumbnail(details.thumbnail);
    return embed;
};
