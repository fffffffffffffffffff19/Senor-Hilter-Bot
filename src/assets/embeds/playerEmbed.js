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

    return new EmbedBuilder()
        .setAuthor({
            name: '⋮ Now Playing ·',
            iconURL: track.requestedBy.avatarURL(),
        })
        .setDescription(`[${track.title}](${track.url})\nDuration: ${track.duration}`)
        .setImage(randomImage())
        .setThumbnail(track.thumbnail)
        .setColor(color || '#FFFFFF')
        .setFooter({
            text: 'fffffffffffffffs • /help for all commands',
            iconURL: avatarURL,
        })
        .setTimestamp();
};
