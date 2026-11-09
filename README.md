# Senor-Hilter-Bot

A modular Discord music bot using Discord.js and Lavalink v4. Lavalink runs as a separate audio service; the bot connects to it through `discord-lavalink`.

## Requirements

- Node.js 22.22.2 or newer
- Yarn Classic
- Docker Compose (for the included Lavalink service)
- A Discord application and bot token
- Spotify developer credentials for Spotify track and playlist metadata resolution
- A burner/secondary Google account (for one-time YouTube OAuth device authorization)

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

4. **Authenticate YouTube (Required):**
   YouTube enforces anti-bot verification (`Sign in to confirm you’re not a bot` / `This video requires login`) on automated clients and servers. To enable smooth playback across all YouTube tracks, perform the one-time OAuth device authorization:

   - Check the Lavalink container logs:
     ```sh
     docker compose logs lavalink | grep -A 4 "OAUTH INTEGRATION"
     ```
   - Open [google.com/device](https://www.google.com/device) in your browser using a secondary or burner Google account.
   - Enter the device code shown in the logs (e.g., `ABCD-EFGH`) and grant access.

   > **Security Note:** This authorization runs inside the container runtime. No Google passwords, user credentials, or tokens are written to your bot codebase or tracked by Git.

5. Register the slash commands and start the bot:

   ```sh
   yarn register-slash
   yarn start
   ```

   For development, run `yarn start:dev`. The bot creates its SQLite database on startup and waits for Lavalink's authenticated readiness endpoint before connecting.

The Compose file binds Lavalink to localhost by default. If the bot is on another host, set `LAVALINK_HOST`, `LAVALINK_PORT`, and `LAVALINK_SECURE` accordingly, and restrict the Lavalink port to trusted clients.

## Docker run modes

### Bot on the host, Lavalink in Docker

Copy `.env.example` to `.env`, set the required Discord, Lavalink, and Spotify values, then start only Lavalink:

```sh
docker compose up -d lavalink
yarn install
yarn start
```

Keep `LAVALINK_HOST=127.0.0.1` and `LAVALINK_PORT=2333` in `.env` for this mode. Lavalink can take a few seconds to load its plugins; the bot waits for it to become ready before opening the connection.

### Bot and Lavalink in Docker

With the same `.env` file configured, build and start both services:

```sh
docker compose --profile bot up -d --build
```

The Compose profile points the bot at the `lavalink` service over the private Compose network; it overrides `LAVALINK_HOST` for the container, so the host value can remain `127.0.0.1`. Stop the services with `docker compose --profile bot down`.

The bot image excludes `.env`; Compose supplies it at runtime. Do not copy secrets into the image or commit `.env`.

## Tests

Run the mocked slash-command suite and lint checks with:

```sh
yarn test
yarn lint
```

The command tests exercise all registered slash commands without connecting to Discord or Lavalink.

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
