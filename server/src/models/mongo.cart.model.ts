import { Schema, model } from 'mongoose';
import { CartI } from '../config/interfaces';

const CartModel = new Schema<CartI>(
	{
		status: {
			type: Boolean,
			required: [true, 'Please include a state, must be true or false'],
		},
		userId: {
			type: String,
			required: [true, 'Please include the user id'],
			unique: true,
		},
		items: [
			{
				_id: false,
				productId: {
					type: Schema.Types.ObjectId,
					ref: 'product',
				},
				quantity: {
					type: Number,
					min: 0,
					require: true,
					default: 0,
				},
			},
		],
		quantity: {
			type: Number,
			required: true,
			default: 0,
			min: 0,
		},
		subTotal: {
			default: 0,
			type: Number,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export default model<CartI>('cart', CartModel);
