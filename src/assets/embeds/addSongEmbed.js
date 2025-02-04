const { EmbedBuilder } = require('discord.js');

module.exports = (song) =>
    new EmbedBuilder()
        .setAuthor({
            name: '⋮ Song Added ·',
            iconURL: song.user.avatarURL(),
        })
        .setDescription(`[${song.name}](${song.url})`)
        .setThumbnail(`${song.thumbnail}`)
        .setColor('#191970')
        .setFooter({
            text: 'fffffffffffffffs • /help for all commands',
            iconURL: 'https://cdn3.emoji.gg/emojis/3551-music.gif',
        })
        .setTimestamp()
        .setImage('https://i.imgur.com/eiwgdXB.png');
