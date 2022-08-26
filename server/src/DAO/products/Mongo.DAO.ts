import { CommonMethodsDAO, NewProductI, PersistenceType, ProductI } from '../../config/interfaces';
import mongodbProductModel from '../../models/mongo.prod.model';
import { mongoConnection } from '../../services/MongoDB';
import { date_creator } from '../../utils/date';
import mongoose from 'mongoose';

export class MongoDAO implements CommonMethodsDAO {
	private product: any;

	constructor(public persistence: PersistenceType) {
		this.product = mongodbProductModel;
		this.initMongo();
	}

	private async initMongo() {
		await mongoConnection(this.persistence);
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
		const timestamp = await date_creator();

		const newProduct = new this.product({ ...newProductData, timestamp });
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
