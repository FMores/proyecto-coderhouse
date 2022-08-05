import { CommonMethodsDAO, NewProductI, PersistenceType, ProductI } from '../../config/interfaces';
import { mongoConnection } from '../../services/MongoDB';
import mongoose from 'mongoose';
import mongodbProductModel from '../../models/mongo.prod.model';

export class MongoDAO implements CommonMethodsDAO {
	private product: any;

	constructor() {
		this.product = mongodbProductModel;
	}

	private async checkId(id: string): Promise<null | undefined> {
		if (!mongoose.isValidObjectId(id)) return null;
	}

	public async get(id?: string): Promise<ProductI[]> {
		if (id) {
			await this.checkId(id);
			const productById = await this.product.findById(id);

			if (!productById) {
				return [];
			}
			return productById;
		}

		const currentProducts = await this.product.find();
		return currentProducts;
	}

	public async add(newProductData: NewProductI): Promise<ProductI> {
		const newProduct = new this.product(newProductData);
		const savedProduct = await newProduct.save();
		return savedProduct;
	}

	public async update(id: string, newProductData: NewProductI): Promise<ProductI | null> {
		await this.checkId(id);

		const updatedProduct = await this.product.findByIdAndUpdate(id, newProductData, { new: true });

		return updatedProduct;
	}

	public async delete(id: string): Promise<null | undefined> {
		await this.checkId(id);

		const result = await this.product.findByIdAndDelete(id);
		return;
	}
}
