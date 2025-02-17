const { EmbedBuilder } = require('discord.js');

module.exports = async (autoplay) => {
    if (autoplay) {
        return new EmbedBuilder()
            .setAuthor({ name: '⋮ Autoplay is Enabled' })
            .setDescription(' ')
            .setColor('#00ff00')
            .setFooter({
                text: 'fffffffffffffffs • /help for all commands',
                iconURL: 'https://cdn3.emoji.gg/emojis/3551-music.gif',
            })
            .setTimestamp()
            .setImage('https://i.imgur.com/eiwgdXB.png');
    }

    return new EmbedBuilder()
        .setAuthor({ name: '⋮ Autoplay is Disabled' })
        .setDescription(' ')
        .setColor('#ff1100')
        .setFooter({
            text: 'fffffffffffffffs • /help for all commands',
            iconURL: 'https://cdn3.emoji.gg/emojis/3551-music.gif',
        })
        .setTimestamp()
        .setImage('https://i.imgur.com/eiwgdXB.png');
};
