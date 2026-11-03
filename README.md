# Senor-Hilter-Bot

A modular Discord music bot using Discord.js and Lavalink v4. Lavalink runs as a separate audio service; the bot connects to it through `lavalink-client`.

## Requirements

- Node.js 22.22.2 or newer
- Yarn Classic
- Docker Compose (for the included Lavalink service)
- A Discord application and bot token
- Spotify developer credentials for Spotify track and playlist metadata resolution

## Setup

1. Install the bot dependencies:

   ```sh
   yarn install
   ```

2. Copy `.env.example` to `.env` and set `TOKEN`, `CLIENT_ID`, a strong `LAVALINK_PASSWORD`, and Spotify developer `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET`.
3. Start Lavalink:

   ```sh
   docker compose up -d lavalink
   ```

   The provided [Lavalink configuration](./lavalink/application.yml) enables YouTube, SoundCloud, Bandcamp, Vimeo, Twitch, and HTTP sources. Spotify links are resolved to metadata and matched to playable YouTube tracks; Spotify does not provide playback through Lavalink.
4. Register the slash commands and start the bot:

   ```sh
   yarn register-slash
   yarn start
   ```

   For development, run `yarn dev`. The bot creates its SQLite database on startup.

The Compose file binds Lavalink to localhost by default. If the bot is on another host, set `LAVALINK_HOST`, `LAVALINK_PORT`, and `LAVALINK_SECURE` accordingly, and restrict the Lavalink port to trusted clients.

## Supported playback input

- YouTube URLs, video IDs, and text searches
- SoundCloud, Bandcamp, Vimeo, and Twitch URLs supported by their Lavalink source managers
- Spotify track, album, and playlist URLs through LavaSrc metadata resolution and YouTube matching
- Direct HTTP(S) audio URLs and uploaded audio files selected with `/play` for formats Lavalink can decode (including MP3, FLAC, WAV, AAC, and OGG)

The HTTP source can only read URLs reachable by the Lavalink host. Discord attachment URLs may expire, so enqueue them shortly after upload.
The bot rejects local hostnames and IP-literal URLs. Keep Lavalink reachable only by the bot and apply network egress restrictions appropriate to your deployment.

Autoplay is best-effort: when the queue ends, the bot searches YouTube using the last track's artist and title and queues the first different result. It is not a curated recommendation feed. Repeat mode replays the current track.

## Project layout

- `src/app.js` — validates environment and starts database, handlers, events, and Discord client.
- `src/main.js` — creates the Discord.js client and Lavalink manager.
- `src/audio/` — Lavalink event handling, playback controls, player panel, and track metadata mapping.
- `src/commands/` and `src/buttons/` — slash-command and player-button modules.
- `src/events/` and `src/handlers/` — Discord event and interaction registration.
- `src/database/` and `src/class/` — Sequelize guild configuration, logging, and shared services.
- `lavalink/` — Lavalink v4 plugin and source configuration.

## Releases

Every push to `main` runs Semantic Release. Commit messages follow Conventional Commits: `fix:` creates a patch, `feat:` creates a minor release, and a `BREAKING CHANGE:` footer creates a major release. The workflow updates `package.json`, commits the version, creates a GitHub release, and pushes the matching `vX.Y.Z` tag. The action requires repository contents write permission.
