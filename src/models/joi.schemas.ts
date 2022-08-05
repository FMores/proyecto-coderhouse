import Joi, { ObjectSchema } from 'joi';

export const new_product: ObjectSchema = Joi.object().keys({
	name: Joi.string().min(3).max(100).required(),
	price: Joi.number().min(0).required().strict(),
	thumbnail: Joi.string().required(),
});

export const update_product: ObjectSchema = Joi.object().keys({
	name: Joi.string().min(3).max(20).optional,
	price: Joi.number().min(0),
	thumbnail: Joi.string(),
});

export const MySQL_post_schema: ObjectSchema = Joi.object().keys({
	user_id: Joi.string().required(),
	product_id: Joi.string().required(),
});

export const signup: ObjectSchema = Joi.object().keys({
	full_name: Joi.string().min(3).max(100).required().label('User name is required, please add one.'),
	adress: Joi.string().min(6).max(250).required().label('Adress is required, pleasee add one.'),
	age: Joi.number().required().label('First name is required, please add one.'),
	phone_number: Joi.number().min(8).max(15).required().label('Phone number is required, pleasee add one.'),
	profile_picture: Joi.string().required().label('An image is required, pleasee add one.'),
	password: Joi.string().alphanum().min(6).max(50).required().label('Insert valid passwort. Must be between 6 and 50 characters '),
	email: Joi.string().email({
		minDomainSegments: 2,
		tlds: { allow: ['com', 'net'] },
	}),
});

export const login: ObjectSchema = Joi.object().keys({
	password: Joi.string().alphanum().min(4).max(50).required().label('Insert valid passwort. Must be between 6 and 50 characters '),
	email: Joi.string().email({
		minDomainSegments: 2,
		tlds: { allow: ['com', 'net'] },
	}),
});
