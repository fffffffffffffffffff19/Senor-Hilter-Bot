const { EmbedBuilder } = require('discord.js');

module.exports = {
    noQueueToSkip: 'No have song to skip on queue.',

    noQueue: 'Any song on queue.',

    notPaused: 'This song is not paused.',

    hasPaused: 'This song is already paused',

    needVoiceChannel: 'You need to join a voice channel.',

    linkNotSuported: 'This link is not suported to play',

    helpEmbed: new EmbedBuilder()
        .setTitle('__All my commands__')
        .addFields(
            {
                name: '`/play <link>`',
                value: '_Play the sound from the link._',
                inline: true,
            },
            {
                name: '`/skip`',
                value: '_Skip to the next song._',
                inline: true,
            },
            {
                name: '`/queue`',
                value: '_Display the playlist sounds._',
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
        .setThumbnail('https://cdn.discordapp.com/avatars/1171060823356084294/cef18a76e9d6c1d4ec1b41362c544568.png?size=4096')
        .setColor('#00b0f4')
        .setFooter({
            text: 'fffffffffffffffs',
        })
        .setTimestamp(),

    playSong: (song, autoplay, paused) => new EmbedBuilder()
        .setAuthor({
            name: '⋮ Now Playing ·',
            iconURL: song.user.avatarURL(),
        })
        .setDescription(`[${song.name}](${song.url})\n**Length: ${song.formattedDuration} Autoplay: ${autoplay ? '<:sim:1179101437351972956>' : '<:nao:1179101253729525860>'} Paused: ${paused ? '<:sim:1179101437351972956>' : '<:nao:1179101253729525860>'}**`)
        .setImage('https://images-ext-2.discordapp.net/external/CF3Jn45RilI2fXH_0ZZOa6ZZ7OxzJyEXnpf5tFW6H6k/https/i.imgur.com/sscpYbT.jpg')
        .setThumbnail(`${song.thumbnail}`)
        .setColor('#F6CCDF')
        .setFooter({
            text: 'fffffffffffffffs',
            iconURL: 'https://cdn3.emoji.gg/emojis/3551-music.gif',
        })
        .setTimestamp(),

    addSong: (song) => new EmbedBuilder()
        .setAuthor({
            name: '| Song Added',
            iconURL: song.user.avatarURL(),
        })
        .setDescription(`[${song.name}](${song.url})`)
        .setThumbnail(`${song.thumbnail}`)
        .setColor('#0080ff')
        .setTimestamp(),
};
