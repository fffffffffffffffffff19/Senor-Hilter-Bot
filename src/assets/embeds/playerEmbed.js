const { EmbedBuilder } = require('discord.js');
const { avatarURL, color, embedImages } = require('../../../config');

const randomImage = () => embedImages[Math.floor(Math.random() * embedImages.length)];

module.exports = ({ song, autoplay, paused } = {}) =>
    new EmbedBuilder()
        .setAuthor({
            name: song ? '⋮ Now Playing ·' : '⋮ Nothing playing  ·  /play <link>',
            iconURL: song ? song?.user.avatarURL() : avatarURL,
        })
        .setDescription(
            song
                ? `[${song?.name}](${song?.url})\n**Length: ${song?.formattedDuration} Autoplay: ${autoplay ? '<:sim:1179101437351972956>' : '<:nao:1179101253729525860>'} Paused: ${paused ? '<:sim:1179101437351972956>' : '<:nao:1179101253729525860>'}**`
                : null,
        )
        .setImage(randomImage())
        .setThumbnail(song ? song?.thumbnail : null)
        .setColor(color || '#FFFFFF')
        .setFooter({
            text: 'fffffffffffffffs • /help for all commands',
            iconURL: avatarURL,
        })
        .setTimestamp();
