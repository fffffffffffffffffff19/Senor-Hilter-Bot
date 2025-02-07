const { findEvents } = require('../class/fileExplorer');
const { createLogger } = require('../class/logger');

module.exports = (client) => {
    try {
        for (const event of findEvents()) {
            if (!event.name) return;
            if (event.once) client.once(event.name, (...args) => event.execute(...args));
            else client.on(event.name, (...args) => event.execute(...args));
        }
    } catch (error) {
        console.log(error);
        createLogger.error(__filename, error);
    }
};
