const Distube = require('distube').default;
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { DeezerPlugin } = require('@distube/deezer');
const { FileExplorer } = require('./src/tools/fileExplorer');
const client = require('./app');

client.skipManual = false;

const distube = new Distube(client, {
    emitNewSongOnly: false,
    leaveOnFinish: true,
    leaveOnEmpty: true,
    leaveOnStop: true,
    savePreviousSongs: true,
    searchSongs: 0,
    plugins: [new SpotifyPlugin(), new SoundCloudPlugin(), new DeezerPlugin()],
});

/* distube.on('addSong', (queue, song) => {
    if (!queue.songs[1]) return;

    queue.textChannel.send({ embeds: [addSong(song)] });
}); */

FileExplorer.findDistubeEvents().forEach((event) => require(event)(distube));

module.exports = distube;
