import { MsgFileSystemDAO } from './FileSystem.DAO';
import { FireBaseMsgDAO } from './FireBase.DAO';
import { MsgMongoDAO } from './Mongo.DAO';
import path from 'path';
import { logger } from '../../utils/winston.logger';
import { PersistenceType } from '../../config/interfaces';

export class MsgFactory {
	static get(type?: PersistenceType) {
		switch (type) {
			case PersistenceType.Mongo:
				logger.info('Starting Mongo_Local_DB for messages');
				return new MsgMongoDAO(PersistenceType.Mongo);
			case PersistenceType.Mongo_Atlas:
				logger.info('Starting Mongo_Atlas_DB for messages');
				return new MsgMongoDAO(PersistenceType.Mongo_Atlas);
			case PersistenceType.FireBase:
				logger.info('Starting FireBase_DB for messages');
				return new FireBaseMsgDAO();
			default:
				PersistenceType.FileSystem;
				logger.info('Starting local file persistence for messages');
				const fileLocation = path.resolve(__dirname, '../db/messages.json');
				return new MsgFileSystemDAO(fileLocation);
		}
	}
}
