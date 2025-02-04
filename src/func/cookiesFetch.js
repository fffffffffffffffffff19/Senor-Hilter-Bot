const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

module.exports = () => {
    try {
        return JSON.parse(readFileSync(resolve('src', 'cookie.json')));
    } catch {
        return undefined;
    }
};
