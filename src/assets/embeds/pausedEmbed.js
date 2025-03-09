const { EmbedBuilder } = require('discord.js');

module.exports = async (paused) => {
    if (paused) {
        return new EmbedBuilder()
            .setAuthor({ name: '⋮ Paused' })
            .setDescription(null)
            .setColor('#00ff00')
            .setFooter({
                text: 'fffffffffffffffs • /help for all commands',
                iconURL: 'https://cdn3.emoji.gg/emojis/3551-music.gif',
            })
            .setTimestamp()
            .setImage('https://i.imgur.com/eiwgdXB.png');
    }

    return new EmbedBuilder()
        .setAuthor({ name: '⋮ Unpaused' })
        .setDescription(null)
        .setColor('#ff1100')
        .setFooter({
            text: 'fffffffffffffffs • /help for all commands',
            iconURL: 'https://cdn3.emoji.gg/emojis/3551-music.gif',
        })
        .setTimestamp()
        .setImage('https://i.imgur.com/eiwgdXB.png');
};
