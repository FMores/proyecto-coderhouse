import mongoose from 'mongoose';
import config from '../config';
import { logger } from '../utils/winston.logger';

export const mongoConnection = async () => {
	try {
		if (config.MONGODB_MODE === 'local') {
			await mongoose.connect(config.MONGO_LOCAL_URI);

			logger.info('Successful connection to local MongoDB');
			return;
		} else {
			await mongoose.connect(
				`mongodb+srv://${config.MONGO_ATLAS_USER}:${config.MONGO_ATLAS_PWD}@cluster0.lbhel.mongodb.net/${config.MONGO_ATLAS_DBNAME}?retryWrites=true&w=majority`,
			);
			logger.info('Successful connection to MongoDB Atlas');
			return;
		}
	} catch (err: any) {
		logger.error(`Cannot connect to the database because: ${err.message}`);
	}
};
