import dotenv from 'dotenv';

const { hideBin } = require('yargs/helpers');
export const yargs = require('yargs/yargs')(hideBin(process.argv)).argv;

dotenv.config();

export default {
	/* SERVER AND DATABASE */
	SERVER_MODE: process.env.SERVER_MODE || yargs.SERVER_MODE || 'Fork',
	SERVER_PORT: process.env.SERVER_PORT || yargs.SERVER_PORT || 8080,
	MONGODB_MODE: process.env.MONGODB_MODE || yargs.MONGODB_MODE || 'local',
	MONGO_LOCAL_URI: process.env.MONGO_LOCAL_URI || 'your_local_uri',
	MONGO_ATLAS_URI: process.env.MONGO_ATLAS_URI || 'your_mongo_atlas_uri',
	MYSQL_ENV: process.env.MYSQL_ENV || 'your_knex_config_enviroment',
	SQLITE3_ENV: process.env.SQLITE3_ENV || 'your_knex_config_enviroment',
	FIREBASE_ACCOUNT_CONFIG: process.env.FIREBASE_ACCOUNT_CONFIG || 'your_FIREBASE_ACCOUNT_CONFIG',

	/* SESSION CONFIG */
	EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET || 'your_EXPRESS_SESSION_SECRET',
	COOKIE_PARSER_SECRET: process.env.COOKIE_PARSER_SECRET || 'your_COOKIE_PARSER_SECRET',

	/* MAILING AND PHONE MESSAGES */
	ETHEREAL_EMAIL: process.env.ETHEREAL_EMAIL || 'your_ETHEREAL_EMAIL',
	ETHEREAL_PASSWORD: process.env.ETHEREAL_PASSWORD || 'your_ETHEREAL_PASSWORD',
	ETHEREAL_NAME: process.env.ETHEREAL_NAME || 'your_ETHEREAL_NAME',
	GMAIL_OWNER_ADRESS: process.env.GMAIL_OWNER_ADRESS || 'your_GMAIL_ADRESS',
	GMAIL_OWNER_PASSWORD: process.env.GMAIL_OWNER_PASSWORD || 'your_GMAIL_PASSWORD',
	GMAIL_OWNER_NAME: process.env.GMAIL_OWNER_NAME || 'your_GMAIL_NAME',
	TWILIO_SID: process.env.TWILIO_SID || 'your_TWILIO_SID',
	TWILIO_TOKEN: process.env.TWILIO_TOKEN || 'your_TWILIO_TOKEN',
	TWILIO_SMS_NUMBER: process.env.TWILIO_SMS_NUMBER || 'your_TWILIO_SMS_NUMBER',
	TWILIO_WSP_NUMBER: process.env.TWILIO_WSP_NUMBER || 'your_TWILIO_WSP_NUMBER',
};
