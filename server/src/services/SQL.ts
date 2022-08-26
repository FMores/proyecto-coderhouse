import config from '../config';
import DB_config from '../config/knexfile';
import knex from 'knex';
import { logger } from '../utils/winston.logger';
import { PersistenceType } from '../config/interfaces';

export const sqlConnection = async (type: PersistenceType) => {
	try {
		if (type === 'MySQL' && (await knex(DB_config[config.MYSQL_ENV]).raw('SELECT VERSION()'))) {
			logger.info('Successful connection to MySQL database');

			return knex(DB_config[config.MYSQL_ENV]);
		} else if (type === 'SQLite3' && (await knex(DB_config[config.SQLITE3_ENV]).raw('SELECT sqlite_version()'))) {
			logger.info('Successful connection to SQLite3 database');

			return knex(DB_config[config.SQLITE3_ENV]);
		} else {
			logger.error('type must be "MySQL" or "SQLite3"');
		}
	} catch (err: any) {
		logger.error(`Cannot connect to the database because: ${err.message}`);
	}
};
