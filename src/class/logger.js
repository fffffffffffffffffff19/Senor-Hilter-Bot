require('winston-daily-rotate-file');

const { mkdirSync } = require('node:fs');
const { resolve } = require('node:path');
const { createLogger, format, transports } = require('winston');

const logDirectory = resolve(process.cwd(), 'logs');
mkdirSync(logDirectory, { recursive: true });

const logger = createLogger({
    format: format.combine(
        format.label({ label: '(º～º)' }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.colorize({ level: true }),
        format.printf(({ level, label, timestamp, message }) => {
            return `${timestamp} ${label} ${level}: ${message}`;
        }),
    ),
    transports: [
        new transports.Console({ level: 'error' }),
        new transports.DailyRotateFile({
            format: format.uncolorize(),
            level: 'error',
            filename: resolve(logDirectory, 'error-%DATE%.log'),
            datePattern: 'DD-MM-YYYY',
            maxSize: '5m',
        }),
        new transports.DailyRotateFile({
            format: format.uncolorize(),
            level: 'warn',
            filename: resolve(logDirectory, 'warn-%DATE%.log'),
            datePattern: 'DD-MM-YYYY',
            maxSize: '5m',
        }),
    ],
});

function formatMessage(args) {
    return args
        .map((value) => {
            if (value instanceof Error) return value.stack || value.message;
            if (typeof value === 'string') return value;
            return JSON.stringify(value);
        })
        .filter(Boolean)
        .join(' ');
}

module.exports = {
    createLogger: {
        error: (...args) => logger.error(formatMessage(args)),
        warn: (...args) => logger.warn(formatMessage(args)),
    },
    fileName: (filePath) => `[${filePath.split(/[\\/]/).find((file) => file.endsWith('.js'))}] -`,
};
