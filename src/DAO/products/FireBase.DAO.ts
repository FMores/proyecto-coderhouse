import { fireBaseConnection } from '../../services/FireBase';
import { NewProductI, ProductI } from '../../config/interfaces';

export class FireBaseDAO {
	private db: any;
	private collection: any;

	constructor() {
		this.db = fireBaseConnection();
		this.collection = this.db.collection('products');
	}

	public async get(id?: string): Promise<ProductI[]> {
		if (id) {
			const result = await this.collection.doc(id).get();
			if (result.data()) {
				const productById = [{ _id: result.id, ...result.data(), timestamp: new Date(result._createTime.seconds * 1000) }];
				return productById;
			}
			return [];
		}

		const snapshot = await this.collection.get();
		const docs = snapshot.docs;
		const productList = docs.map((aDocs: any) => ({
			_id: aDocs.id,
			...aDocs.data(),
			timestamp: new Date(aDocs._createTime.seconds * 1000),
		}));
		return productList;
	}

	public async add(newProductData: NewProductI): Promise<ProductI> {
		const result = await this.collection.add(newProductData);
		const idNewProduct = result._path.segments[1];
		const newProduct = await this.get(idNewProduct);
		return newProduct[0];
	}

	public async update(id: string, newProductData: NewProductI): Promise<ProductI | null> {
		const existId = await this.get(id);

		if (existId.length === 0) {
			return null;
		}

		await this.collection.doc(id).update(newProductData);
		const updated = await this.get(id);
		return updated[0];
	}

	public async delete(id: string): Promise<null | undefined> {
		const existId = await this.get(id);

		if (existId.length === 0) {
			return null;
		}

		await this.collection.doc(id).delete();
	}
}
