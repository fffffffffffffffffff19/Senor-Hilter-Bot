const { EmbedBuilder } = require('discord.js');

module.exports = (track) =>
    new EmbedBuilder()
        .setAuthor({
            name: '⋮ Song Skiped ·',
            iconURL: track.requestedBy.avatarURL(),
        })
        .setDescription(`[${track.title}](${track.url})`)
        .setThumbnail(`${track.thumbnail}`)
        .setColor('#00ffec')
        .setFooter({
            text: 'fffffffffffffffs • /help for all commands',
            iconURL: 'https://cdn3.emoji.gg/emojis/3551-music.gif',
        })
        .setTimestamp()
        .setImage('https://i.imgur.com/eiwgdXB.png');
