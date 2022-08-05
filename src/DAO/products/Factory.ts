import path from 'path';
import { PersistenceType } from '../../config/interfaces';
import { logger } from '../../utils/winston.logger';
import { FileSystemDAO } from './FileSystem.DAO';
import { FireBaseDAO } from './FireBase.DAO';
import { MemoryDAO } from './LocalMemory.DAO';
import { MongoDAO } from './Mongo.DAO';
import { MysqlDAO } from './MySQL.DAO';
import { Sqlite3DAO } from './SQLite3.DAO';

export class ProductFactoryDAO {
	static get(type: PersistenceType) {
		switch (type) {
			case PersistenceType.FileSystem:
				logger.info('Starting local file persistence for products');
				const fileLocation = path.resolve(__dirname, '../../DB/productDB.json');
				return new FileSystemDAO(fileLocation);
			case PersistenceType.Mongo:
				logger.info('Starting Mongo_Local_DB for products');
				return new MongoDAO();
			case PersistenceType.Mongo_Atlas:
				logger.info('Starting Mongo_Atlas_DB for products');
				return new MongoDAO();
			case PersistenceType.MySQL:
				logger.info('Starting MySQL_DB for products');
				return new MysqlDAO(PersistenceType.MySQL);
			case PersistenceType.SQLite3:
				logger.info('Starting SQLite3_DB for products');
				return new Sqlite3DAO(PersistenceType.SQLite3);
			case PersistenceType.FireBase:
				logger.info('Starting FireBase_DB for products');
				return new FireBaseDAO();
			default:
				PersistenceType.Memory;
				logger.info('Starting Local Memory DB for products');
				return new MemoryDAO();
		}
	}
}
