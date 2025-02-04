module.exports = (distube) => {
    distube.on('ffmpegDebug', (debug) => {
        console.log(debug);
    });
};
