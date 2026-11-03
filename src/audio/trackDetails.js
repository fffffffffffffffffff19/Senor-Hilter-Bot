function formatDuration(milliseconds, isStream) {
    if (isStream) return 'LIVE';

    const totalSeconds = Math.floor((milliseconds || 0) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return hours
        ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        : `${minutes}:${String(seconds).padStart(2, '0')}`;
}

module.exports = (track) => {
    const info = track?.info || track || {};
    const requester = info.requester || track?.requester;

    return {
        title: info.title || 'Unknown track',
        url: info.uri,
        duration: formatDuration(info.length, info.isStream),
        thumbnail: info.artworkUrl,
        requestedBy: requester,
    };
};
