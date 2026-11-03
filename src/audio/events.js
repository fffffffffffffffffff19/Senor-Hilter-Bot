const { guildGet, guildUpdate } = require('../class/guildTemplate');
const { createLogger, fileName } = require('../class/logger');
const { resetPlayerPanel, updatePlayerPanel } = require('./playerPanel');

function registerAudioEvents(client, lavalink) {
    lavalink.on('trackStart', async (player, track) => {
        try {
            await updatePlayerPanel(client, player.guildId, track);
        } catch (error) {
            createLogger.error(fileName(__filename), error);
        }
    });

    lavalink.on('queueEnd', async (player) => {
        let resumedWithAutoplay = false;

        try {
            const guildConfig = await guildGet(player.guildId);
            const previousTrack = player.queue.previous.at(-1);

            if (guildConfig?.autoplay) {
                if (previousTrack) {
                    try {
                        const { author, title, identifier } = previousTrack.info;
                        const search = await player.search(
                            { query: `${author} similar to ${title}` },
                            previousTrack.info.requester,
                        );
                        const recommendation = search.tracks.find(
                            (candidate) =>
                                candidate.info.identifier !== identifier &&
                                !player.queue.tracks.some(
                                    (queuedTrack) =>
                                        queuedTrack.info.identifier === candidate.info.identifier,
                                ),
                        );

                        if (recommendation) {
                            await player.queue.add(recommendation);
                            await player.play();
                            resumedWithAutoplay = true;
                            return;
                        }
                    } catch (error) {
                        createLogger.error(fileName(__filename), error);
                    }
                }

                createLogger.warn(
                    `Autoplay could not find a similar track for guild ${player.guildId}.`,
                );
            }

            await guildUpdate({
                guildId: player.guildId,
                paused: false,
                repeatMode: false,
            });
            await resetPlayerPanel(client, player.guildId);
        } catch (error) {
            createLogger.error(fileName(__filename), error);
        } finally {
            if (!resumedWithAutoplay) {
                try {
                    await player.destroy('queue ended');
                } catch (error) {
                    createLogger.error(fileName(__filename), error);
                }
            }
        }
    });

    lavalink.on('trackError', (player, track, payload) => {
        const title = track?.info?.title || 'Unknown track';
        const reason = payload.exception?.message || payload.exception?.cause || 'Unknown Lavalink error';
        createLogger.error(fileName(__filename), new Error(`Playback failed for "${title}": ${reason}`));
    });

    lavalink.on('trackStuck', (player, track, payload) => {
        const title = track?.info?.title || 'Unknown track';
        createLogger.warn(`Track "${title}" stalled in guild ${player.guildId} after ${payload.thresholdMs}ms.`);
    });
}

module.exports = registerAudioEvents;
