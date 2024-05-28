# Senor-Hilter-Bot
My first discord music (maybe) bot.

# install and usage
* `choco install ffmpeg` or `winget install "FFmpeg (Essentials Build)"` to install [ffmpeg](https://ffmpeg.org/download.html#build-windows)
* `yarn install` (to install all bot dependencies)
* Create a `.env` in the same place as the `config.js`
  ```
  TOKEN=<bot token>
  CLIENT_ID=<bot client id>
  ```
* Configure the bot client on `config.js` (like username, icon, banner, etc..)
* `yarn registerSlash` (to register all slash commands)
* `yarn start` (if you want to run in background, use `yarn pm2` and `yarn stop` to stop the pm2 process)
* To create the bot invite link go on [Discord Developer Portal](https://discord.com/developers/applications) 
  - (Your bot application -> Installation) <details> <summary>Image Spoiler (click me)</summary> ![image](https://i.imgur.com/4pETVDv.png) </details> 

# Example on running
![image](https://github.com/fffffffffffffffffff19/Senor-Hilter-Bot/assets/108289513/339f8507-76cf-4cc7-bd44-28808e03f307)
