import { format, createLogger, transports, config, Logger } from 'winston';
const { combine, timestamp, json, cli } = format;

const warnFilter = format((info, opts) => {
	return info.level === 'warn' ? info : false;
});

const errorFilter = format((info, opts) => {
	return info.level === 'error' ? info : false;
});

export const logger = createLogger({
	transports: [
		new transports.File({
			filename: './src/logs/warn.log',
			level: 'warn',
			format: combine(
				warnFilter(),
				timestamp({
					format: 'DD-MM-YY hh:mm:ss.SSS A',
				}),
				json(),
			),
		}),
		new transports.File({
			filename: './src/logs/error.log',
			level: 'error',
			format: combine(
				errorFilter(),
				timestamp({
					format: 'DD-MM-YY hh:mm:ss.SSS A',
				}),
				json(),
			),
		}),
		new transports.Console({ level: 'info', format: cli() }),
	],
});
