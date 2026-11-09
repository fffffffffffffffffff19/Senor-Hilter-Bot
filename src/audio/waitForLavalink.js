const { setTimeout: delay } = require('node:timers/promises');
const { createLogger, fileName } = require('../class/logger');

async function waitForLavalink(node, { fetchImpl = globalThis.fetch, sleep = delay } = {}) {
    const protocol = node.options.secure ? 'https' : 'http';
    const url = `${protocol}://${node.options.host}:${node.options.port}/v4/info`;
    let attempts = 0;

    while (true) {
        attempts += 1;
        let response;

        try {
            response = await fetchImpl(url, {
                headers: { Authorization: node.options.authorization },
                signal: AbortSignal.timeout(5000),
            });
        } catch (error) {
            if (attempts === 1 || attempts % 5 === 0) {
                createLogger.warn(
                    fileName(__filename),
                    `Waiting for Lavalink at ${protocol}://${node.options.host}:${node.options.port}:`,
                    error,
                );
            }
            await sleep(2000);
            continue;
        }

        if (response.status === 401 || response.status === 403) {
            throw new Error(
                `Lavalink rejected authentication at ${protocol}://${node.options.host}:${node.options.port}; check that LAVALINK_PASSWORD matches the server.`,
            );
        }

        if (response.status >= 500) {
            if (attempts === 1 || attempts % 5 === 0) {
                createLogger.warn(
                    fileName(__filename),
                    `Lavalink at ${protocol}://${node.options.host}:${node.options.port} returned HTTP ${response.status}; retrying.`,
                );
            }
            await sleep(2000);
            continue;
        }

        if (!response.ok) {
            throw new Error(
                `Lavalink readiness check at ${protocol}://${node.options.host}:${node.options.port} failed with HTTP ${response.status}.`,
            );
        }

        return;
    }
}

module.exports = waitForLavalink;
