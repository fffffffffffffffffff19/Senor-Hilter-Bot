const { EmbedBuilder } = require('discord.js');

module.exports = {
    noQueueToSkip: 'No have song to skip on queue.',

    noQueue: 'Any song on queue.',

    notPaused: 'This song is not paused.',

    hasPaused: 'This song is already paused',

    needVoiceChannel: 'You need to join a voice channel.',

    linkNotSuported: 'This link is not suported to play',

    needResume: 'Need to resume the song to skip',

    shuffled: 'Shuffled the queue.',

    helpEmbed: new EmbedBuilder()
        .setTitle('__All my commands__')
        .addFields(
            {
                name: '`/play`',
                value: '_Play the sound from the link._',
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
        .setThumbnail('https://cdn.discordapp.com/avatars/1171060823356084294/cef18a76e9d6c1d4ec1b41362c544568.png?size=4096')
        .setColor('#00b0f4')
        .setImage('https://i.imgur.com/Git3K4Z.png'),

    playSong: (song, autoplay, paused) => new EmbedBuilder()
        .setAuthor({
            name: '⋮ Now Playing ·',
            iconURL: song.user.avatarURL(),
        })
        .setDescription(`[${song.name}](${song.url})\n**Length: ${song.formattedDuration} Autoplay: ${autoplay ? '<:sim:1179101437351972956>' : '<:nao:1179101253729525860>'} Paused: ${paused ? '<:sim:1179101437351972956>' : '<:nao:1179101253729525860>'}**`)
        .setImage('https://i.imgur.com/xf3Jt9w.png')
        .setThumbnail(`${song.thumbnail}`)
        .setColor('#F6CCDF')
        .setFooter({
            text: 'fffffffffffffffs • /help for all commands',
            iconURL: 'https://cdn3.emoji.gg/emojis/2062-pixel-dvd4.gif',
        })
        .setTimestamp(),

    addSong: (song) => new EmbedBuilder()
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
        .setImage('https://i.imgur.com/eiwgdXB.png'),

    finishedSong: (song) => new EmbedBuilder()
        .setAuthor({
            name: '⋮ Song Finished ·',
            iconURL: song.user.avatarURL(),
        })
        .setDescription(`[${song.name}](${song.url})`)
        .setThumbnail(`${song.thumbnail}`)
        .setColor('#838996')
        .setFooter({
            text: 'fffffffffffffffs • /help for all commands',
            iconURL: 'https://cdn3.emoji.gg/emojis/6027-pixel-dvd.gif',
        })
        .setTimestamp()
        .setImage('https://i.imgur.com/F6SURf1.png'),

    skipedSong: (song) => new EmbedBuilder()
        .setAuthor({
            name: '⋮ Song Skiped ·',
            iconURL: song.user.avatarURL(),
        })
        .setDescription(`[${song.name}](${song.url})`)
        .setThumbnail(`${song.thumbnail}`)
        .setColor('#800080')
        .setFooter({
            text: 'fffffffffffffffs • /help for all commands',
            iconURL: 'https://cdn3.emoji.gg/emojis/4643-exclamation-2.gif',
        })
        .setTimestamp()
        .setImage('https://i.imgur.com/njETY9v.png'),

    addPlaylist: (playlist) => new EmbedBuilder()
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
        .setImage('https://i.imgur.com/irl7Kk3.png'),
};
