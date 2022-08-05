import { Schema, model } from 'mongoose';
import { ProductI } from '../config/interfaces';

export const ProductModel = new Schema<ProductI>(
	{
		name: {
			type: String,
			required: [true, 'Is required'],
			max: 20,
		},
		price: {
			type: Number,
			required: [true, 'Is required'],
		},
		thumbnail: {
			type: String,
			required: [true, 'Is required'],
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export default model<ProductI>('product', ProductModel);
