import Config from '../config';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { logger } from '../utils/winston.logger';

export const fireBaseConnection = () => {
	initializeApp({
		credential: cert(Config.FIREBASE_ACCOUNT_CONFIG),
	});

	const db = getFirestore();

	logger.info('Successful connection to FireBase database');

	return db;
};
