const Distube = require('distube').default;
const { EmbedBuilder } = require('discord.js');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { DeezerPlugin } = require('@distube/deezer');
const client = require('../../app');

client.skipManual = false;

const distube = new Distube(client, {
    emitNewSongOnly: false,
    leaveOnEmpty: true,
    leaveOnFinish: true,
    leaveOnStop: true,
    savePreviousSongs: true,
    searchSongs: 0,
    plugins: [new SpotifyPlugin(), new SoundCloudPlugin(), new DeezerPlugin()],
});

module.exports = distube;

distube.on('playSong', async (queue, song) => {
    if (await client.skipManual === true) {
        client.skipManual = false;
        return;
    }

    const embed = new EmbedBuilder()
        .setTitle('__Now Playing__')
        .setDescription(`[${song.name}](${song.url})`)
        .setThumbnail(`${song.thumbnail}`)
        .setColor('#52057b')
        .setTimestamp(new Date().getTime());

    queue.textChannel.send({ embeds: [embed] });
});

distube.on('addSong', (queue, song) => {
    if (!queue.songs[1]) return;

    const embed = new EmbedBuilder()
        .setTitle('__Song Added__')
        .setDescription(`[${song.name}](${song.url})`)
        .setThumbnail(`${song.thumbnail}`)
        .setColor('#0080ff')
        .setTimestamp(new Date().getTime());

    queue.textChannel.send({ embeds: [embed] });
});

distube.on('skip', (queue) => {
    const embed = new EmbedBuilder()
        .setTitle('__Song skiped__')
        .setDescription(`Now playing:\n[${queue.songs[1].name}](${queue.songs[1].url})\n
            Previous song:\n[${queue.songs[0].name}](${queue.songs[0].url})`)
        .setThumbnail(`${queue.songs[1].thumbnail}`)
        .setColor('#ffff00');

    queue.textChannel.send({ embeds: [embed] });
});
