const database = require('../database/models/guildConfig');

class GuildTemplate {
    constructor() {
        // get a guild config from database
        this.guildGet = async (guildId) => await database.findOne({ where: { guild: guildId } });
        // delete a guild config on database
        this.guildDelete = async (guildId) => await database.destroy({ where: { guild: guildId } });
        // fetch a guild config on database
        this.guildFetch = async (guildId) => {
            return (await database.findOne({ where: { guild: guildId } })) ? true : false;
        };
        // create a new guild config on database
        this.guildCreate = async (guildId) => {
            await database.create({
                guild: guildId,
                textChannel: null,
                autoplay: false,
                paused: false,
                repeatMode: false,
            });
        };
        // update a guildconfig on database
        this.guildUpdate = async ({ guildId, textChannel, webhookMessage, autoplay, paused, repeatMode } = {}) => {
            // throw a error if guildId is undefined
            if (!guildId) throw new Error('guildId cannot be undefined');
            // function to handle field and values
            const updateDatabase = async (field, newValue) => {
                if (newValue === undefined) return;

                await database.update({ [field]: newValue }, { where: { guild: guildId } });
            };
            // parsing all values to check alteration
            await updateDatabase('textChannel', textChannel?.id);
            await updateDatabase('webhookMessage', webhookMessage?.id);
            await updateDatabase('autoplay', autoplay);
            await updateDatabase('paused', paused);
            await updateDatabase('repeatMode', repeatMode);
        };
    }
}

module.exports = new GuildTemplate();
