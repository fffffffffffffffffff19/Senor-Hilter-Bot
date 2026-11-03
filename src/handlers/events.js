const { findEvents } = require('../class/fileExplorer');
const { createLogger, fileName } = require('../class/logger');

module.exports = (client) => {
    for (const event of findEvents()) {
        const execute = (...args) => {
            Promise.resolve()
                .then(() => event.execute(...args))
                .catch((error) => {
                    createLogger.error(fileName(__filename), error);
                });
        };
        if (event.once) client.once(event.name, execute);
        else client.on(event.name, execute);
    }
};
