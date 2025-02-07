const { EmbedBuilder } = require('discord.js');
const { avatarURL, color, embedImages } = require('../../../config');

const randomImage = () => embedImages[Math.floor(Math.random() * embedImages.length)];

module.exports = ({ track, autoplay, paused } = {}) =>
    new EmbedBuilder()
        .setAuthor({
            name: track ? '⋮ Now Playing ·' : '⋮ Nothing playing  ·  /play <link>',
            iconURL: track ? track.requestedBy.avatarURL() : avatarURL,
        })
        .setDescription(
            track
                ? `[${track.title}](${track.url})\n**Length: ${track.duration} Autoplay: ${autoplay ? '<:sim:1179101437351972956>' : '<:nao:1179101253729525860>'} Paused: ${paused ? '<:sim:1179101437351972956>' : '<:nao:1179101253729525860>'}**`
                : null,
        )
        .setImage(randomImage())
        .setThumbnail(track ? track.thumbnail : null)
        .setColor(color || '#FFFFFF')
        .setFooter({
            text: 'fffffffffffffffs • /help for all commands',
            iconURL: avatarURL,
        })
        .setTimestamp();
