import { Strategy as LocalStrategy } from 'passport-local';
import mongoUserModel from '../models/mongo.user.model';
import { Request, Response } from 'express';
import passport from 'passport';
import { logger } from '../utils/winston.logger';

declare global {
	namespace Express {
		interface User {
			_id?: string;
			email: string;
			password: string;
			full_name: string;
			adress: string;
			age: number;
			phone_number: string;
		}
	}
}

const strategyOptions: any = {
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true,
};

const loginFunc = async (req: Request, email: string, password: string, done: any) => {
	const user = await mongoUserModel.findOne({ email });

	if (!user) {
		return done(null, false, 'Invalid email!');
	}

	if (!(await user.comparePwd(password))) {
		return done(null, false, 'Invalid password!');
	}

	return done(null, user);
};

const signUpFunc = async (req: Request, email: string, password: string, done: any) => {
	const { full_name, adress, age, phone_number } = req.body;
	const picture_data = req.file;

	const user = await mongoUserModel.findOne({ email: email });

	if (user) {
		return done(null, false, 'User already exists');
	} else {
		const userData = {
			full_name,
			adress,
			age,
			phone_number,
			profile_picture: picture_data?.originalname,
			email,
			password,
		};

		const newUser = new mongoUserModel(userData);

		await newUser.save();

		return done(null, newUser);
	}
};

passport.use('login', new LocalStrategy(strategyOptions, loginFunc));

passport.use('signup', new LocalStrategy(strategyOptions, signUpFunc));

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((userId, done) => {
	mongoUserModel.findById(userId, function (err: any, user: any) {
		done(err, user);
	});
});

export const isLoggedIn = (req: Request, res: Response, done: any) => {
	if (!req.user) return res.redirect('/api/auth/login');
	done();
};
