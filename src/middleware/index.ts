import config from '../config';
import session from 'express-session';

export const session_config = session({
	secret: config.EXPRESS_SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60,
	},
});
