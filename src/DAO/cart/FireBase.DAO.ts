import { CartMethodsDAO, PersistenceType } from '../../config/interfaces';
import mongodbProductModel from '../../models/mongo.prod.model';
import { mongoConnection } from '../../services/MongoDB';
import mongodbCartModel from '../../models/mongo.cart.model';
import mongoose from 'mongoose';

// Harcoded userId = '628c290ebeed9a7b4df6b722';

export class FireBaseCartDAO implements CartMethodsDAO<any> {
	private cart: any;
	private product: any;

	constructor() {
		this.cart = mongodbCartModel;
		this.product = mongodbProductModel;
	}

	private async checkId(id: string): Promise<null | undefined> {
		if (!mongoose.isValidObjectId(id)) return null;
	}

	public async get(id?: string): Promise<any> {
		if (id) {
			await this.checkId(id);
			const cartByUserId = await this.cart.find({ userId: id }); //.populate('items.productId');
			return cartByUserId;
		}

		const listOfCart = await this.cart.find();
		return listOfCart;
	}

	public async add(id: string, id_prod: string): Promise<any> {
		await this.checkId(id);

		const productData = await this.product.find({ _id: id_prod });

		console.log('627ef69e38e660455bb4c322:', productData);

		const currentCart = await this.get(id);

		if (currentCart.length > 0) {
			const existProduct = currentCart[0].items.filter((el: any) => el._id.toString() === id_prod);

			// if (existProduct.length > 0) {
			// 	const cartUpdated = await this.cart.findOneAndUpdate(
			// 		{ userId: id, 'items._id': id_prod },
			// 		{
			// 			$set: {
			// 				'items.$.quantity': currentCart[0].items[0].quantity + 1,
			// 				quantity: currentCart[0].quantity + 1,
			// 				subTotal: currentCart[0].subTotal + productData[0].price,
			// 			},
			// 		},
			// 	);

			// 	cartUpdated.save();
			// 	return [];
			// }

			// const cartUpdated = await this.cart.findOneAndUpdate(
			// 	{ userId: id },
			// 	{ $set: { quantity: currentCart[0].quantity + 1, subTotal: currentCart[0].subTotal + newtData.price } },
			// );

			// cartUpdated.items.quantity = cartUpdated.items.quantity + 1;

			// cartUpdated.items.push(id_prod);

			// cartUpdated.save();

			return [];
		}

		const newCart = {
			status: true,
			userId: id,
			items: { id_prod, quantity: 1 },
			quantity: 1,
			subTotal: productData[0].price,
		};

		const cart = new this.cart(newCart);
		await cart.save();
		return [];
	}

	public async delete(id: string, id_prod: string): Promise<any> {
		return [];
	}
}
