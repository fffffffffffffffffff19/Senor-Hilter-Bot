const { guildGet, guildUpdate } = require('../class/guildTemplate');
const { disableAutoplay, disableRepeatMode } = require('../assets/txt/response');

async function togglePause(player) {
    if (player.paused) {
        await player.resume();
        return false;
    }

    await player.pause();
    return true;
}

async function toggleRepeat(player, guildId) {
    const enabled = player.repeatMode !== 'track';
    const guildConfig = await guildGet(guildId);

    if (enabled && guildConfig.autoplay) return { error: disableAutoplay };

    await player.setRepeatMode(enabled ? 'track' : 'off');
    await guildUpdate({ guildId, repeatMode: enabled });
    return { enabled };
}

async function toggleAutoplay(player, guildId) {
    const guildConfig = await guildGet(guildId);
    if (guildConfig.repeatMode) return { error: disableRepeatMode };

    const enabled = !guildConfig.autoplay;
    if (enabled && player.repeatMode !== 'off') await player.setRepeatMode('off');
    await guildUpdate({ guildId, autoplay: enabled, repeatMode: false });
    return { enabled };
}

async function playPrevious(player) {
    const previousTrack = player.queue.previous.at(-1);
    if (!previousTrack) return false;

    await player.play({ clientTrack: previousTrack });
    return true;
}

async function shuffle(player) {
    return player.queue.shuffle();
}

async function stop(player) {
    await player.stopPlaying(true);
    await player.destroy('stopped by user');
}

module.exports = { playPrevious, shuffle, stop, toggleAutoplay, togglePause, toggleRepeat };
