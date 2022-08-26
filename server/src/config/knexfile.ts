import type { Knex } from 'knex';
import path from 'path';

const DB_config: { [key: string]: Knex.Config } = {
	development: {
		client: 'mysql',
		connection: {
			host: '127.0.0.1',
			user: 'root',
			password: '',
			database: 'ecommerce',
		},
		migrations: {
			directory: '../DB/migrations',
			extension: 'ts',
		},
		seeds: {
			directory: '../DB/seeds',
			extension: 'ts',
		},
		pool: { min: 0, max: 10 },
	},
	localStorage: {
		client: 'sqlite3',
		connection: {
			filename: path.resolve('src/DB/ecommerce.sqlite'),
		},
		useNullAsDefault: true,
		pool: { min: 0, max: 7 },
	},
};

export default DB_config;
