const fs = require('node:fs');
const path = require('node:path');

class FileExplorer {
    static findButtons() {
        const foldersPath = path.join(__dirname, '../commands');
        const itemsFolders = fs.readdirSync(foldersPath);
        const items = [];

        for (const folder of itemsFolders) {
            const itemsPath = path.join(foldersPath, folder);
            const itemsFile = fs.readdirSync(itemsPath).filter((item) => item.match('buttons'));

            for (const item of itemsFile) {
                const itemPath = path.join(itemsPath, item);
                const buttons = fs.readdirSync(itemPath).filter((i) => i.endsWith('.js'));

                for (const button of buttons) {
                    const files = path.join(itemPath, button);
                    const allButtons = require(files);

                    items.push(allButtons);
                }
            }
        }
        return items;
    }

    static findCommands() {
        const foldersPath = path.join(__dirname, '../commands');
        const itemsFolders = fs.readdirSync(foldersPath);
        const items = [];

        for (const folder of itemsFolders) {
            const itemsPath = path.join(foldersPath, folder);
            const itemsFile = fs.readdirSync(itemsPath).filter((item) => item.endsWith('.js'));

            for (const item of itemsFile) {
                const itemPath = path.join(itemsPath, item);
                const importedItems = require(itemPath);

                items.push(importedItems);
            }
        }
        return items;
    }

    static findEvents() {
        const foldersPath = path.join(__dirname, '../events');
        const itemsFolders = fs.readdirSync(foldersPath);
        const items = [];

        for (const folder of itemsFolders) {
            const itemsPath = path.join(foldersPath, folder);
            const itemsFile = fs.readdirSync(itemsPath).filter((item) => item.endsWith('.js'));

            for (const item of itemsFile) {
                const itemPath = path.join(itemsPath, item);
                const importedItems = require(itemPath);

                items.push(importedItems);
            }
        }
        return items;
    }

    static findHandlers() {
        const handlersPath = path.join(__dirname, '../handlers');
        const handlers = fs.readdirSync(handlersPath).filter((filter) => filter.endsWith('.js'));
        const items = [];

        for (const handler of handlers) {
            const handlerPath = path.join(handlersPath, handler);

            items.push(handlerPath);
        }

        return items;
    }

    static findDistubeEvents() {
        const eventsPath = path.join(__dirname, '../events/distube');
        const events = fs.readdirSync(eventsPath).filter((filter) => filter.endsWith('.js'));
        const items = [];

        for (const event of events) {
            const eventPath = path.join(eventsPath, event);

            items.push(eventPath);
        }

        return items;
    }
}

module.exports = { FileExplorer };
