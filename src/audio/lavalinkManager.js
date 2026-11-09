const { EventEmitter } = require('node:events');
const { Lavalink: DiscordLavalink } = require('discord-lavalink');

function normalizeTrack(rawTrack, requester) {
    if (!rawTrack) return null;
    const info = rawTrack.info || {};
    const trackRequester = requester || rawTrack.requester || info.requester;
    return {
        encoded: rawTrack.encoded,
        info: {
            ...info,
            requester: trackRequester,
        },
        requester: trackRequester,
    };
}

class Queue {
    constructor() {
        this.tracks = [];
        this.current = null;
        this.previous = [];
    }

    add(tracks) {
        if (Array.isArray(tracks)) {
            this.tracks.push(...tracks);
        } else if (tracks) {
            this.tracks.push(tracks);
        }
    }

    shuffle() {
        for (let i = this.tracks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
        }
        return this.tracks;
    }

    clear() {
        this.tracks = [];
    }
}

class Player {
    constructor(manager, options) {
        this.manager = manager;
        this.guildId = options.guildId;
        this.voiceChannelId = options.voiceChannelId;
        this.textChannelId = options.textChannelId || null;
        this.selfDeaf = options.selfDeaf ?? true;
        this.volume = options.volume ?? 100;
        this.paused = false;
        this.playing = false;
        this.connected = false;
        this.repeatMode = 'off'; // 'off' | 'track'
        this.queue = new Queue();
    }

    async search({ query }, requester) {
        try {
            let result;
            if (query.startsWith('http://') || query.startsWith('https://')) {
                result = await this.manager.backend.loadTracks(query);
            } else if (/^(ytsearch|ytmsearch|scsearch|spsearch|dzsearch|amsearch|ymsearch):/.test(query)) {
                result = await this.manager.backend.loadTracks(query);
            } else {
                result = await this.manager.backend.tracks(query, 'ytsearch');
                if (
                    !result ||
                    result.loadType === 'empty' ||
                    result.loadType === 'error' ||
                    (Array.isArray(result.data) && result.data.length === 0)
                ) {
                    result = await this.manager.backend.tracks(query, 'ytmsearch');
                }
            }

            if (!result || !result.loadType) {
                return { playlist: false, tracks: [] };
            }

            if (result.loadType === 'search') {
                const tracks = (Array.isArray(result.data) ? result.data : [])
                    .map((t) => normalizeTrack(t, requester))
                    .filter(Boolean);
                return { playlist: false, tracks };
            }

            if (result.loadType === 'playlist') {
                const list = result.data?.tracks || [];
                const tracks = list.map((t) => normalizeTrack(t, requester)).filter(Boolean);
                return { playlist: true, tracks };
            }

            if (result.loadType === 'track') {
                const track = normalizeTrack(result.data, requester);
                return { playlist: false, tracks: track ? [track] : [] };
            }

            return { playlist: false, tracks: [] };
        } catch {
            return { playlist: false, tracks: [] };
        }
    }

    async connect() {
        const guild = this.manager.client.guilds.cache.get(this.guildId);
        if (guild) {
            guild.shard.send({
                op: 4,
                d: {
                    guild_id: this.guildId,
                    channel_id: this.voiceChannelId,
                    self_mute: false,
                    self_deaf: Boolean(this.selfDeaf),
                },
            });
        }
        this.connected = true;
    }

    async changeVoiceState({ voiceChannelId }) {
        this.voiceChannelId = voiceChannelId;
        const guild = this.manager.client.guilds.cache.get(this.guildId);
        if (guild) {
            guild.shard.send({
                op: 4,
                d: {
                    guild_id: this.guildId,
                    channel_id: voiceChannelId,
                    self_mute: false,
                    self_deaf: Boolean(this.selfDeaf),
                },
            });
        }
    }

    async play(options = {}) {
        if (options.clientTrack) {
            if (this.queue.current) {
                this.queue.tracks.unshift(this.queue.current);
            }
            this.queue.current = options.clientTrack;
            const prevIndex = this.queue.previous.lastIndexOf(options.clientTrack);
            if (prevIndex !== -1) {
                this.queue.previous.splice(prevIndex, 1);
            }
        } else if (!this.queue.current && this.queue.tracks.length > 0) {
            this.queue.current = this.queue.tracks.shift();
        }

        if (!this.queue.current) {
            this.playing = false;
            this.manager.emit('queueEnd', this);
            return;
        }

        const trackToPlay = this.queue.current;
        await this.manager.backend.play(this.guildId, trackToPlay.encoded, {
            volume: this.volume,
            paused: false,
        });

        this.playing = true;
        this.paused = false;
    }

    async pause() {
        await this.manager.backend.pause(this.guildId, true);
        this.paused = true;
    }

    async resume() {
        await this.manager.backend.pause(this.guildId, false);
        this.paused = false;
    }

    async skip() {
        if (this.queue.current) {
            this.queue.previous.push(this.queue.current);
            if (this.queue.previous.length > 25) {
                this.queue.previous.shift();
            }
        }

        if (this.queue.tracks.length > 0) {
            this.queue.current = this.queue.tracks.shift();
            await this.play();
        } else {
            this.queue.current = null;
            this.playing = false;
            await this.manager.backend.stop(this.guildId).catch(() => {});
            this.manager.emit('queueEnd', this);
        }
    }

    setRepeatMode(mode) {
        this.repeatMode = mode;
    }

    async stopPlaying(clearQueue = false) {
        if (clearQueue) {
            this.queue.clear();
        }
        this.queue.current = null;
        this.playing = false;
        this.paused = false;
        await this.manager.backend.stop(this.guildId).catch(() => {});
    }

    async destroy() {
        await this.stopPlaying(true);
        const guild = this.manager.client.guilds.cache.get(this.guildId);
        if (guild) {
            guild.shard.send({
                op: 4,
                d: {
                    guild_id: this.guildId,
                    channel_id: null,
                    self_mute: false,
                    self_deaf: false,
                },
            });
        }
        this.connected = false;
        this.manager.players.delete(this.guildId);
    }
}

class LavalinkManager extends EventEmitter {
    constructor(client, options) {
        super();
        this.client = client;
        this.options = options;
        this.players = new Map();

        const protocol = options.secure ? 'https' : 'http';
        const host = options.host || '127.0.0.1';
        const port = options.port || 2333;
        const baseUrl = `${protocol}://${host}:${port}`;

        this.backend = new DiscordLavalink({
            client,
            baseUrl,
            password: options.password,
            logLevel: 'normal',
        });

        const nodeOptions = {
            host,
            port,
            authorization: options.password,
            secure: Boolean(options.secure),
        };
        this.node = { options: nodeOptions };
        this.nodeManager = {
            nodes: new Map([['primary', this.node]]),
        };

        this.backend.on('ready', (payload) => {
            this.emit('ready', payload);
        });

        this.backend.on('trackStart', (payload) => {
            const player = this.players.get(payload.guildId);
            if (!player) return;
            player.playing = true;
            player.paused = false;
            const track = player.queue.current || normalizeTrack(payload.track);
            this.emit('trackStart', player, track);
        });

        this.backend.on('trackEnd', async (payload) => {
            const player = this.players.get(payload.guildId);
            if (!player) return;

            if (payload.reason === 'finished') {
                if (player.repeatMode === 'track' && player.queue.current) {
                    await player.play();
                    return;
                }

                if (player.queue.current) {
                    player.queue.previous.push(player.queue.current);
                    if (player.queue.previous.length > 25) {
                        player.queue.previous.shift();
                    }
                }

                if (player.queue.tracks.length > 0) {
                    player.queue.current = player.queue.tracks.shift();
                    await player.play();
                } else {
                    player.queue.current = null;
                    player.playing = false;
                    this.emit('queueEnd', player);
                }
            } else if (payload.reason === 'stopped' || payload.reason === 'cleanup') {
                player.playing = false;
            }
        });

        this.backend.on('trackException', (payload) => {
            const player = this.players.get(payload.guildId);
            this.emit('trackError', player, player?.queue?.current, payload);
        });

        this.backend.on('trackStuck', (payload) => {
            const player = this.players.get(payload.guildId);
            this.emit('trackStuck', player, player?.queue?.current, payload);
        });
    }

    getPlayer(guildId) {
        return this.players.get(guildId) || null;
    }

    createPlayer(options) {
        const existing = this.players.get(options.guildId);
        if (existing) return existing;

        const player = new Player(this, options);
        this.players.set(options.guildId, player);
        return player;
    }

    deletePlayer(guildId) {
        this.players.delete(guildId);
    }

    async init() {
        if (this.backend.sessionId) return this;

        if (!this.client.application?.id && this.client.user?.id) {
            if (!this.client.application) {
                this.client.application = { id: this.client.user.id };
            } else {
                this.client.application.id = this.client.user.id;
            }
        }

        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                if (this.backend.sessionId) resolve(this);
                else reject(new Error('Lavalink connection timed out waiting for ready'));
            }, 15000);

            const onReady = () => {
                this.backend.off('ready', onReady);
                clearTimeout(timer);
                resolve(this);
            };

            this.backend.on('ready', onReady);

            try {
                this.backend.connect();
            } catch (err) {
                clearTimeout(timer);
                reject(err);
            }
        });
    }

    async sendRawData(packet) {
        // Forwarded directly via raw event in app.js
        return packet;
    }
}

module.exports = LavalinkManager;
