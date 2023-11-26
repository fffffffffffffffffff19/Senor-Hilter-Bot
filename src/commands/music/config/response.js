const { EmbedBuilder } = require('discord.js');

module.exports = {
    noQueueToSkip: 'No have song to skip on queue.',
    noQueue: 'Any song on queue.',
    notPaused: 'This song is not paused.',
    songResume: 'Resumed the song.',
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
    autoplayEmbed: (autoplay) => new EmbedBuilder()
        .setDescription(`Autoplay is ${autoplay ? 'On' : 'Off'}`)
        .setColor(`${autoplay ? '#0aff00' : '#ff0000'}`)
        .setTimestamp(new Date().getTime()),
    stopEmbed: new EmbedBuilder()
        .setDescription('Stopped current queue.')
        .setColor('#ff0000')
        .setTimestamp(new Date().getTime()),
    queueList: (queue) => queue.songs
        .map((song, position) => `${position === 0 ? 'Playing:' : `${position}.`} [${song.name}](${song.url})`)
        .join('\n'),
    hasPaused: 'This song is already paused',
    songPaused: 'Paused the song.',
    needVoiceChannel: 'You need to join a voice channel.',
    linkNotSuported: 'This link is not suported to play',
};
