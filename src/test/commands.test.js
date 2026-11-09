const assert = require('node:assert/strict');
const Module = require('node:module');
const path = require('node:path');
const { createRequire } = require('node:module');
const test = require('node:test');

const commandDirectory = path.resolve(__dirname, '../commands');
const expectedCommands = [
    'autoplay',
    'help',
    'pause',
    'play',
    'previous',
    'repeat',
    'response',
    'resume',
    'sending',
    'setchannel',
    'setup',
    'shuffle',
    'skip',
    'stop',
];

function loadModule(modulePath, mocks) {
    const resolveFromModule = createRequire(modulePath);
    const replacements = new Map(
        Object.entries(mocks).map(([request, exports]) => [resolveFromModule.resolve(request), exports]),
    );
    const originalLoad = Module._load;

    Module._load = function (request, parent, isMain) {
        const resolvedPath = Module._resolveFilename(request, parent, isMain);
        if (replacements.has(resolvedPath)) return replacements.get(resolvedPath);
        return originalLoad.call(this, request, parent, isMain);
    };

    delete require.cache[modulePath];
    try {
        return require(modulePath);
    } finally {
        Module._load = originalLoad;
    }
}

function loadCommand(relativePath, mocks) {
    return loadModule(path.join(commandDirectory, relativePath), mocks);
}

function asyncSpy(implementation = async () => undefined) {
    const calls = [];
    return {
        calls,
        fn: async (...args) => {
            calls.push(args);
            return implementation(...args);
        },
    };
}

function makeInteraction(overrides = {}) {
    const calls = {
        reply: [],
        followUp: [],
        deferReply: [],
        editReply: [],
        deleteReply: [],
    };
    const interaction = {
        guildId: 'guild-1',
        channelId: 'text-channel-1',
        user: { id: 'user-1' },
        client: {},
        options: {
            getString: () => null,
            getAttachment: () => null,
            getChannel: () => null,
        },
        replied: false,
        deferred: false,
        async reply(payload) {
            calls.reply.push(payload);
            this.replied = true;
        },
        async followUp(payload) {
            calls.followUp.push(payload);
        },
        async deferReply(payload) {
            calls.deferReply.push(payload);
            this.deferred = true;
        },
        async editReply(payload) {
            calls.editReply.push(payload);
        },
        async deleteReply() {
            calls.deleteReply.push([]);
        },
        ...overrides,
    };

    return { interaction, calls };
}

function commandErrorHandler(values = {}) {
    return async () => ({ guildId: 'guild-1', player: {}, voiceChannel: { id: 'voice-1' }, ...values });
}

test('discovers every registered slash command', () => {
    const { findCommands } = require('../class/fileExplorer');
    const mainPath = createRequire(path.join(commandDirectory, 'music/play.js')).resolve('../../main');
    const originalLoad = Module._load;
    Module._load = function (request, parent, isMain) {
        if (Module._resolveFilename(request, parent, isMain) === mainPath) return { lavalink: {} };
        return originalLoad.call(this, request, parent, isMain);
    };

    let commands;
    try {
        commands = findCommands();
    } finally {
        Module._load = originalLoad;
    }

    assert.deepEqual(
        commands.map((command) => command.data.name).sort(),
        expectedCommands,
    );
});

test('registers Discord event handlers only once during startup', async () => {
    const { EventEmitter } = require('node:events');
    const { Collection } = require('discord.js');
    const appPath = path.resolve(__dirname, '../app.js');
    const eventsHandlerPath = path.resolve(__dirname, '../handlers/events.js');
    const resolveFromApp = createRequire(appPath);
    const client = new EventEmitter();
    const lavalink = new EventEmitter();
    const registration = asyncSpy();
    const login = asyncSpy();
    client.login = login.fn;
    lavalink.sendRawData = async () => undefined;

    const mocks = new Map(
        [
            ['dotenv', { config() { } }],
            ['discord.js', { Collection }],
            ['./main', { client, lavalink }],
            [
                './class/fileExplorer',
                {
                    findHandlers: () => [eventsHandlerPath],
                    findEvents: () => [{ name: 'ready', once: true, execute: async () => undefined }],
                },
            ],
            ['./class/logger', { createLogger: { error() { }, warn() { } }, fileName: () => 'app.js' }],
            ['./database/sequelize', { authenticate: async () => undefined }],
            ['./database/models/guildConfig', { sync: async () => undefined }],
            ['./audio/events', registration.fn],
        ].map(([request, exports]) => [resolveFromApp.resolve(request), exports]),
    );
    const originalLoad = Module._load;
    const requiredVariables = ['TOKEN', 'CLIENT_ID', 'LAVALINK_PASSWORD'];
    const originalEnvironment = Object.fromEntries(
        requiredVariables.map((key) => [key, process.env[key]]),
    );
    requiredVariables.forEach((key) => {
        process.env[key] = `test-${key}`;
    });

    Module._load = function (request, parent, isMain) {
        const resolvedPath = Module._resolveFilename(request, parent, isMain);
        if (mocks.has(resolvedPath)) return mocks.get(resolvedPath);
        return originalLoad.call(this, request, parent, isMain);
    };

    delete require.cache[appPath];
    delete require.cache[eventsHandlerPath];
    try {
        const start = require(appPath);
        await start();

        assert.equal(client.listenerCount('ready'), 1);
        assert.equal(client.listenerCount('raw'), 1);
        assert.equal(login.calls.length, 1);
        assert.equal(registration.calls.length, 1);
    } finally {
        Module._load = originalLoad;
        delete require.cache[appPath];
        delete require.cache[eventsHandlerPath];
        requiredVariables.forEach((key) => {
            if (originalEnvironment[key] === undefined) delete process.env[key];
            else process.env[key] = originalEnvironment[key];
        });
    }
});

test('waits for the configured Lavalink node before initializing its WebSocket', async () => {
    const node = { options: { host: '127.0.0.1', port: 2333 } };
    const calls = [];
    const waitForLavalink = asyncSpy(async (connectedNode) => {
        assert.equal(connectedNode, node);
        calls.push('ready');
    });
    const init = asyncSpy(async () => calls.push('init'));
    const setPresence = asyncSpy();
    const client = {
        lavalink: {
            nodeManager: { nodes: { get: () => node } },
            init: init.fn,
        },
        user: { id: 'bot-1', username: 'Test bot', setPresence: setPresence.fn },
    };
    const originalConsoleLog = console.log;
    const event = loadModule(path.resolve(__dirname, '../events/bot-started/botStarted.js'), {
        '../../assets/txt/logoCmd.js': 'logo',
        '../../assets/txt/botStatus.js': () => 'status',
        '../../../config.js': { clientPresence: 'test', clientStatus: 'online' },
        '../../audio/waitForLavalink': waitForLavalink.fn,
    });

    console.log = () => undefined;
    try {
        await event.execute(client);
    } finally {
        console.log = originalConsoleLog;
    }

    assert.deepEqual(calls, ['ready', 'init']);
    assert.deepEqual(init.calls[0][0], { id: 'bot-1', username: 'Test bot' });
    assert.equal(setPresence.calls.length, 1);
});

test('waits and retries when Lavalink is still starting', async () => {
    let attempts = 0;
    const sleeps = [];
    const warnings = asyncSpy();
    const waitForLavalink = loadModule(path.resolve(__dirname, '../audio/waitForLavalink.js'), {
        '../class/logger': {
            createLogger: { warn: warnings.fn },
            fileName: () => 'waitForLavalink.js',
        },
    });

    await waitForLavalink(
        { options: { host: '127.0.0.1', port: 2333, authorization: 'test-password', secure: false } },
        {
            fetchImpl: async (url, options) => {
                attempts += 1;
                assert.equal(url, 'http://127.0.0.1:2333/v4/info');
                assert.equal(options.headers.Authorization, 'test-password');
                if (attempts === 1) throw new TypeError('Connection refused');
                return { ok: true, status: 200 };
            },
            sleep: async (milliseconds) => sleeps.push(milliseconds),
        },
    );

    assert.equal(attempts, 2);
    assert.deepEqual(sleeps, [2000]);
    assert.equal(warnings.calls.length, 1);
});

test('reports an incorrect Lavalink password without retrying', async () => {
    const waitForLavalink = loadModule(path.resolve(__dirname, '../audio/waitForLavalink.js'), {
        '../class/logger': { createLogger: { warn() { } }, fileName: () => 'waitForLavalink.js' },
    });
    let attempts = 0;

    await assert.rejects(
        waitForLavalink(
            { options: { host: 'lavalink', port: 2333, authorization: 'test-password', secure: false } },
            {
                fetchImpl: async () => {
                    attempts += 1;
                    return { ok: false, status: 401 };
                },
                sleep: async () => undefined,
            },
        ),
        /check that LAVALINK_PASSWORD matches the server/,
    );
    assert.equal(attempts, 1);
});

test('reports an invalid Lavalink readiness endpoint without retrying', async () => {
    const waitForLavalink = loadModule(path.resolve(__dirname, '../audio/waitForLavalink.js'), {
        '../class/logger': { createLogger: { warn() { } }, fileName: () => 'waitForLavalink.js' },
    });
    let attempts = 0;

    await assert.rejects(
        waitForLavalink(
            { options: { host: 'lavalink', port: 2333, authorization: 'test-password', secure: false } },
            {
                fetchImpl: async () => {
                    attempts += 1;
                    return { ok: false, status: 404 };
                },
                sleep: async () => undefined,
            },
        ),
        /failed with HTTP 404/,
    );
    assert.equal(attempts, 1);
});

test('play searches and queues a track', async () => {
    const track = { info: { title: 'Test track' } };
    const queueAdd = asyncSpy();
    const play = asyncSpy();
    const player = {
        voiceChannelId: 'voice-1',
        connected: true,
        playing: false,
        paused: false,
        queue: { add: queueAdd.fn },
        search: asyncSpy(async () => ({ tracks: [track] })).fn,
        play: play.fn,
    };
    const { interaction, calls } = makeInteraction({
        options: {
            getString: () => 'Test track',
            getAttachment: () => null,
        },
    });
    const command = loadCommand('music/play.js', {
        '../../main': { lavalink: { getPlayer: () => null, createPlayer: () => player } },
        '../../class/guildTemplate': { guildGet: async () => ({ textChannel: 'music-text' }) },
        '../../class/logger': { createLogger: { error() { } }, fileName: () => 'play.js' },
        '../../func/commandErrorHandler': commandErrorHandler(),
        '../../assets/txt/response': { noSongSearch: 'No result.' },
    });

    await command.execute(interaction);

    assert.equal(queueAdd.calls.length, 1);
    assert.deepEqual(queueAdd.calls[0][0], [track]);
    assert.equal(play.calls.length, 1);
    assert.match(calls.reply[0].content, /Added 1 track/);
});

test('play rejects a request without a search term or attachment', async () => {
    const createPlayer = asyncSpy();
    const { interaction, calls } = makeInteraction();
    const command = loadCommand('music/play.js', {
        '../../main': { lavalink: { getPlayer: () => null, createPlayer: createPlayer.fn } },
        '../../class/guildTemplate': { guildGet: async () => ({}) },
        '../../class/logger': { createLogger: { error() { } }, fileName: () => 'play.js' },
        '../../func/commandErrorHandler': commandErrorHandler(),
        '../../assets/txt/response': { noSongSearch: 'No result.' },
    });

    await command.execute(interaction);

    assert.equal(createPlayer.calls.length, 0);
    assert.match(calls.reply[0].content, /Provide either/);
});

test('pause pauses playback and updates the guild state', async () => {
    const pause = asyncSpy();
    const guildUpdate = asyncSpy();
    const notice = asyncSpy();
    const { interaction, calls } = makeInteraction();
    const command = loadCommand('music/pause.js', {
        '../../class/guildTemplate': { guildUpdate: guildUpdate.fn },
        '../../assets/embeds/pausedEmbed': async (paused) => ({ paused }),
        '../../audio/playerPanel': { sendTemporaryNotice: notice.fn },
        '../../assets/txt/response': { hasPaused: 'Already paused.' },
        '../../func/commandErrorHandler': commandErrorHandler({ player: { paused: false, pause: pause.fn } }),
    });

    await command.execute(interaction);

    assert.equal(pause.calls.length, 1);
    assert.deepEqual(guildUpdate.calls[0][0], { guildId: 'guild-1', paused: true });
    assert.equal(notice.calls[0][2].embeds[0].paused, true);
    assert.equal(calls.deleteReply.length, 1);
});

test('resume resumes playback and clears the guild paused state', async () => {
    const resume = asyncSpy();
    const guildUpdate = asyncSpy();
    const notice = asyncSpy();
    const { interaction } = makeInteraction();
    const command = loadCommand('music/resume.js', {
        '../../class/guildTemplate': { guildUpdate: guildUpdate.fn },
        '../../assets/embeds/pausedEmbed': async (paused) => ({ paused }),
        '../../audio/playerPanel': { sendTemporaryNotice: notice.fn },
        '../../assets/txt/response': { notPaused: 'Not paused.' },
        '../../func/commandErrorHandler': commandErrorHandler({ player: { paused: true, resume: resume.fn } }),
    });

    await command.execute(interaction);

    assert.equal(resume.calls.length, 1);
    assert.deepEqual(guildUpdate.calls[0][0], { guildId: 'guild-1', paused: false });
    assert.equal(notice.calls[0][2].embeds[0].paused, false);
});

test('skip skips the current track when the queue has more tracks', async () => {
    const currentTrack = { info: { title: 'Current track' } };
    const skip = asyncSpy();
    const notice = asyncSpy();
    const { interaction } = makeInteraction();
    const command = loadCommand('music/skip.js', {
        '../../class/guildTemplate': { guildGet: async () => ({ autoplay: false }) },
        '../../assets/txt/response': { noQueueToSkip: 'No queued track.' },
        '../../audio/playerPanel': { sendTemporaryNotice: notice.fn },
        '../../assets/embeds/songSkipedEmbed': (track) => ({ track }),
        '../../func/commandErrorHandler': commandErrorHandler({
            player: { queue: { tracks: [{}], current: currentTrack }, skip: skip.fn },
        }),
    });

    await command.execute(interaction);

    assert.equal(skip.calls.length, 1);
    assert.equal(notice.calls[0][2].embeds[0].track, currentTrack);
});

test('skip rejects an empty queue when autoplay is disabled', async () => {
    const skip = asyncSpy();
    const { interaction, calls } = makeInteraction();
    const command = loadCommand('music/skip.js', {
        '../../class/guildTemplate': { guildGet: async () => ({ autoplay: false }) },
        '../../assets/txt/response': { noQueueToSkip: 'No queued track.' },
        '../../audio/playerPanel': { sendTemporaryNotice: asyncSpy().fn },
        '../../assets/embeds/songSkipedEmbed': () => ({}),
        '../../func/commandErrorHandler': commandErrorHandler({
            player: { queue: { tracks: [], current: {} }, skip: skip.fn },
        }),
    });

    await command.execute(interaction);

    assert.equal(skip.calls.length, 0);
    assert.equal(calls.reply[0].content, 'No queued track.');
});

test('previous plays the previous track when one exists', async () => {
    const playPrevious = asyncSpy(async () => true);
    const { interaction, calls } = makeInteraction();
    const command = loadCommand('music/previous.js', {
        '../../assets/txt/response': { noPreviousSong: 'No previous track.' },
        '../../audio/controls': { playPrevious: playPrevious.fn },
        '../../func/commandErrorHandler': commandErrorHandler({ player: { id: 'player-1' } }),
    });

    await command.execute(interaction);

    assert.equal(playPrevious.calls[0][0].id, 'player-1');
    assert.equal(calls.deleteReply.length, 1);
});

test('previous reports when there is no previous track', async () => {
    const { interaction, calls } = makeInteraction();
    const command = loadCommand('music/previous.js', {
        '../../assets/txt/response': { noPreviousSong: 'No previous track.' },
        '../../audio/controls': { playPrevious: asyncSpy(async () => false).fn },
        '../../func/commandErrorHandler': commandErrorHandler({ player: {} }),
    });

    await command.execute(interaction);

    assert.equal(calls.reply[0].content, 'No previous track.');
});

test('stop resets playback settings, stops the player, and clears the panel', async () => {
    const guildUpdate = asyncSpy();
    const stop = asyncSpy();
    const resetPlayerPanel = asyncSpy();
    const { interaction } = makeInteraction();
    const command = loadCommand('music/stop.js', {
        '../../class/guildTemplate': { guildUpdate: guildUpdate.fn },
        '../../audio/playerPanel': { resetPlayerPanel: resetPlayerPanel.fn },
        '../../audio/controls': { stop: stop.fn },
        '../../func/commandErrorHandler': commandErrorHandler({ player: { id: 'player-1' } }),
    });

    await command.execute(interaction);

    assert.deepEqual(guildUpdate.calls[0][0], {
        guildId: 'guild-1',
        autoplay: false,
        paused: false,
        repeatMode: false,
    });
    assert.equal(stop.calls[0][0].id, 'player-1');
    assert.equal(resetPlayerPanel.calls[0][1], 'guild-1');
});

test('shuffle shuffles the queue and reports success', async () => {
    const shuffle = asyncSpy();
    const notice = asyncSpy();
    const { interaction } = makeInteraction();
    const command = loadCommand('music/shuffle.js', {
        '../../audio/controls': { shuffle: shuffle.fn },
        '../../audio/playerPanel': { sendTemporaryNotice: notice.fn },
        '../../func/commandErrorHandler': commandErrorHandler({ player: { id: 'player-1' } }),
    });

    await command.execute(interaction);

    assert.equal(shuffle.calls[0][0].id, 'player-1');
    assert.equal(notice.calls[0][2].content, 'Queue shuffled.');
});

test('repeat toggles repeat mode and publishes the updated state', async () => {
    const toggleRepeat = asyncSpy(async () => ({ enabled: true }));
    const notice = asyncSpy();
    const { interaction } = makeInteraction();
    const command = loadCommand('music/repeat.js', {
        '../../audio/controls': { toggleRepeat: toggleRepeat.fn },
        '../../assets/embeds/repeatModeEmbed': async (enabled) => ({ enabled }),
        '../../audio/playerPanel': { sendTemporaryNotice: notice.fn },
        '../../func/commandErrorHandler': commandErrorHandler({ player: {}, guildId: 'guild-1' }),
    });

    await command.execute(interaction);

    assert.equal(toggleRepeat.calls.length, 1);
    assert.equal(notice.calls[0][2].embeds[0].enabled, true);
});

test('repeat reports when repeat mode cannot be toggled', async () => {
    const { interaction, calls } = makeInteraction();
    const command = loadCommand('music/repeat.js', {
        '../../audio/controls': { toggleRepeat: asyncSpy(async () => ({ error: 'No current track.' })).fn },
        '../../assets/embeds/repeatModeEmbed': async () => ({}),
        '../../audio/playerPanel': { sendTemporaryNotice: asyncSpy().fn },
        '../../func/commandErrorHandler': commandErrorHandler({ player: {}, guildId: 'guild-1' }),
    });

    await command.execute(interaction);

    assert.equal(calls.reply[0].content, 'No current track.');
});

test('autoplay toggles the setting and publishes the updated state', async () => {
    const toggleAutoplay = asyncSpy(async () => ({ enabled: true }));
    const notice = asyncSpy();
    const { interaction } = makeInteraction();
    const command = loadCommand('music/autoplay.js', {
        '../../audio/controls': { toggleAutoplay: toggleAutoplay.fn },
        '../../audio/playerPanel': { sendTemporaryNotice: notice.fn },
        '../../assets/embeds/autoplayEmbed': async (enabled) => ({ enabled }),
        '../../func/commandErrorHandler': commandErrorHandler({ player: {}, guildId: 'guild-1' }),
    });

    await command.execute(interaction);

    assert.equal(toggleAutoplay.calls.length, 1);
    assert.equal(notice.calls[0][2].embeds[0].enabled, true);
});

test('help replies with the help embed', async () => {
    const helpEmbed = { title: 'Help' };
    const { interaction, calls } = makeInteraction();
    const command = loadCommand('misc/help.js', {
        '../../assets/txt/response': { helpEmbed },
    });

    await command.execute(interaction);

    assert.equal(calls.reply[0].embeds[0], helpEmbed);
});

for (const commandName of ['sending', 'response']) {
    test(`${commandName} replies with its development notice`, async () => {
        const { interaction, calls } = makeInteraction();
        const command = loadCommand(`api/${commandName}.js`, {});

        await command.execute(interaction);

        assert.match(calls.reply[0].content, /In development/);
    });
}

test('setup reuses an existing configured music channel', async () => {
    const channel = { id: 'music-text' };
    const { interaction, calls } = makeInteraction({
        guild: {
            id: 'guild-1',
            channels: { cache: { get: (channelId) => (channelId === channel.id ? channel : undefined) } },
        },
    });
    const command = loadCommand('admin/setup.js', {
        '../../class/guildTemplate': {
            guildCreate: asyncSpy().fn,
            guildFetch: async () => true,
            guildGet: async () => ({ textChannel: channel.id, webhookMessage: 'message-1' }),
            guildUpdate: asyncSpy().fn,
        },
        '../../../config': { clientUsername: 'TestBot' },
        '../../class/webhookManager': {
            createWebhook: asyncSpy().fn,
            fetchWebhook: async () => true,
            getWebhook: () => ({ fetchMessage: async () => ({ id: 'message-1' }) }),
        },
        '../../buttons/creating/playerButtons': { row1: {}, row2: {} },
        '../../assets/embeds/playerEmbed': () => ({}),
    });

    await command.execute(interaction);

    assert.match(calls.editReply[0].content, /already a music text channel/);
});

test('setchannel creates the player message in a selected text channel', async () => {
    const { ChannelType } = require('discord.js');
    const selectedChannel = { id: 'new-music-text', type: ChannelType.GuildText };
    const guildUpdate = asyncSpy();
    const createWebhook = asyncSpy();
    const { interaction, calls } = makeInteraction({
        guild: { id: 'guild-1', channels: { cache: { get: () => undefined } } },
        options: { getChannel: () => selectedChannel },
    });
    const command = loadCommand('admin/setChannel.js', {
        '../../buttons/creating/playerButtons': { row1: {}, row2: {} },
        '../../class/guildTemplate': {
            guildUpdate: guildUpdate.fn,
            guildCreate: asyncSpy().fn,
            guildGet: async () => ({ textChannel: null, webhookMessage: null }),
            guildFetch: async () => true,
        },
        '../../class/webhookManager': {
            fetchWebhook: async () => false,
            getWebhook: () => ({ send: async () => ({ id: 'player-message' }) }),
            createWebhook: createWebhook.fn,
        },
        '../../assets/embeds/playerEmbed': () => ({}),
    });

    await command.execute(interaction);

    assert.equal(createWebhook.calls.length, 1);
    assert.equal(guildUpdate.calls[0][0].textChannel, selectedChannel);
    assert.match(calls.reply[0].content, /new bot player/);
});

test('setchannel rejects non-text channels', async () => {
    const { ChannelType, MessageFlags } = require('discord.js');
    const { interaction, calls } = makeInteraction({
        guild: { id: 'guild-1', channels: { cache: { get: () => undefined } } },
        options: { getChannel: () => ({ id: 'voice-1', type: ChannelType.GuildVoice }) },
    });
    const command = loadCommand('admin/setChannel.js', {
        '../../buttons/creating/playerButtons': { row1: {}, row2: {} },
        '../../class/guildTemplate': {
            guildUpdate: asyncSpy().fn,
            guildCreate: asyncSpy().fn,
            guildGet: async () => ({}),
            guildFetch: async () => true,
        },
        '../../class/webhookManager': {
            fetchWebhook: asyncSpy().fn,
            getWebhook: () => ({}),
            createWebhook: asyncSpy().fn,
        },
        '../../assets/embeds/playerEmbed': () => ({}),
    });

    await command.execute(interaction);

    assert.equal(calls.reply[0].flags, MessageFlags.Ephemeral);
    assert.match(calls.reply[0].content, /only text channel/);
});
