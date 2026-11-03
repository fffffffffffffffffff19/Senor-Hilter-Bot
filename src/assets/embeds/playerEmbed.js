const { EmbedBuilder } = require('discord.js');
const { avatarURL, color, embedImages } = require('../../../config');

const randomImage = () => embedImages[Math.floor(Math.random() * embedImages.length)];

module.exports = ({ track } = {}) => {
    if (!track) {
        return new EmbedBuilder()
            .setAuthor({
                name: '⋮ Nothing playing  ·  /play <link>',
                iconURL: avatarURL,
            })
            .setDescription(null)
            .setImage(randomImage())
            .setThumbnail(null)
            .setColor(color || '#FFFFFF')
            .setFooter({
                text: 'fffffffffffffffs • /help for all commands',
                iconURL: avatarURL,
            })
            .setTimestamp();
    }

    const description = track.url
        ? `[${track.title}](${track.url})\nDuration: ${track.duration}`
        : `${track.title}\nDuration: ${track.duration}`;
    const author = { name: '⋮ Now Playing ·' };
    const avatar = track.requestedBy?.displayAvatarURL?.();
    if (avatar) author.iconURL = avatar;

    const embed = new EmbedBuilder()
        .setAuthor(author)
        .setDescription(description)
        .setImage(randomImage())
        .setColor(color || '#FFFFFF')
        .setFooter({
            text: 'fffffffffffffffs • /help for all commands',
            iconURL: avatarURL,
        })
        .setTimestamp();

    if (track.thumbnail) embed.setThumbnail(track.thumbnail);
    return embed;
};
