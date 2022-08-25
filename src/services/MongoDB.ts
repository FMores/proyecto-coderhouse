import { connect, connection } from 'mongoose';
import { PersistenceType } from '../config/interfaces';
import config from '../config';
import { logger } from '../utils/winston.logger';

export const mongoConnection = async (persistence: PersistenceType) => {
	try {
		if (connection.readyState === 2) {
			return;
		}

		if (persistence === 'Mongo_Local') {
			const local_connection = await connect(config.MONGO_LOCAL_URI);
			logger.info('Successful connection to local MongoDB');
			return local_connection;
		} else {
			const atlas_connection = await connect(config.MONGO_ATLAS_URI);
			logger.info('Successful connection to MongoDB Atlas');
			return atlas_connection;
		}
	} catch (err: any) {
		logger.error(`Cannot connect to the database because: ${err.message}`);
	}
};
