const Distube = require('distube').default;
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const client = require('../../app');

exports.player = new Distube(client, {
    emitNewSongOnly: false,
    leaveOnEmpty: true,
    leaveOnFinish: true,
    leaveOnStop: true,
    savePreviousSongs: true,
    searchSongs: 0,
    plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],
});
