const { EmbedBuilder } = require('discord.js');

module.exports = (playlist) =>
    new EmbedBuilder()
        .setAuthor({
            name: '⋮ Playlist Added ·',
            iconURL: playlist.user.avatarURL({ dynamic: true, size: 2048 }),
        })
        .setDescription(`[${playlist.name}](${playlist.url})`)
        .setThumbnail(`${playlist.thumbnail}`)
        .setColor('#87ceeb')
        .setFooter({
            text: 'fffffffffffffffs • /help for all commands',
            iconURL: 'https://cdn3.emoji.gg/emojis/3551-music.gif',
        })
        .setTimestamp()
        .setImage('https://i.imgur.com/irl7Kk3.png');
