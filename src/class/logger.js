require('winston-daily-rotate-file');

const { mkdirSync, readdirSync, statSync, unlinkSync } = require('node:fs');
const { resolve } = require('node:path');
const { createLogger, format, transports } = require('winston');

const logDirectory = resolve(process.cwd(), 'logs');
mkdirSync(logDirectory, { recursive: true });

const maxFiles = process.env.LOG_MAX_FILES || '14d';

function pruneOldLogs(directory, retentionDays = 14) {
    try {
        const now = Date.now();
        const maxAgeMs = retentionDays * 24 * 60 * 60 * 1000;
        const files = readdirSync(directory);
        for (const file of files) {
            if (!file.endsWith('.log')) continue;
            const filePath = resolve(directory, file);
            const stats = statSync(filePath);
            if (now - stats.mtimeMs > maxAgeMs) {
                unlinkSync(filePath);
            }
        }
    } catch {
        // Ignore pruning errors
    }
}

const retentionDays = parseInt(maxFiles, 10) || 14;
pruneOldLogs(logDirectory, retentionDays);

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
            maxFiles,
            auditFile: resolve(logDirectory, '.audit.json'),
        }),
        new transports.DailyRotateFile({
            format: format.uncolorize(),
            level: 'warn',
            filename: resolve(logDirectory, 'warn-%DATE%.log'),
            datePattern: 'DD-MM-YYYY',
            maxSize: '5m',
            maxFiles,
            auditFile: resolve(logDirectory, '.audit.json'),
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
