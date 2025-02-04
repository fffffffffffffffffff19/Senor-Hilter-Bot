const { EmbedBuilder } = require('discord.js');

module.exports = new EmbedBuilder()
    .setTitle('__All my commands__')
    .addFields(
        {
            name: '`/play`',
            value: '_Play the sound from the link._',
            inline: true,
        },
        {
            name: '`/playskip`',
            value: '_Add a song and skip to it._',
            inline: true,
        },
        {
            name: '`/skip`',
            value: '_Skip to the next song._',
            inline: true,
        },
        {
            name: '`/pause`',
            value: '_Pause the current song._',
            inline: true,
        },
        {
            name: '`/resume`',
            value: '_Resume the current song._',
            inline: true,
        },
        {
            name: '`/autoplay`',
            value: '_Automatically plays songs of the same genre._',
            inline: true,
        },
        {
            name: '`/stop`',
            value: '_Stop playing music and make the bot leave the channel._',
            inline: true,
        },
    )
    .setThumbnail(
        'https://cdn.discordapp.com/avatars/1171060823356084294/cef18a76e9d6c1d4ec1b41362c544568.png?size=4096',
    )
    .setColor('#00b0f4')
    .setImage('https://i.imgur.com/Git3K4Z.png');
