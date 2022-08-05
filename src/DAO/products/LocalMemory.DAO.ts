import { CommonMethodsDAO, NewProductI, ProductI } from '../../config/interfaces';
import { date_creator } from '../../utils/date';
import { code_creator } from '../../utils/uuid';

export class MemoryDAO implements CommonMethodsDAO {
	private products: ProductI[] = [];

	constructor() {
		const mockData = {
			_id: 'PID-c7ef9db3-4901-445a-b42e-760274add5c7',
			code: 'PC-4f0c13fb-e0d0-415f-81c2-705d3852d52x',
			timestamp: '22-05-22 11:20:46 am',
			name: 'Mock',
			description: 'mock data',
			price: 23,
			stock: 30,
			thumbnail: 'mock-data-1',
		};
		this.products.push(mockData);
	}

	private findIndex(id: string) {
		return new Promise<number>((resolve, reject) => {
			resolve(this.products.findIndex((el: ProductI) => el._id === id));
		});
	}

	public async get(id?: string): Promise<ProductI[]> {
		if (id) {
			return this.products.filter((el: ProductI) => el._id === id);
		} else {
			return this.products;
		}
	}

	public async add(newProductData: NewProductI): Promise<ProductI> {
		const timestamp = await date_creator();
		const productId = await code_creator();
		const productCode = await code_creator();

		const newProduct = {
			_id: `PID-${productId}`,
			code: `PC-${productCode}`,
			timestamp,
			...newProductData,
		};

		this.products.push(newProduct);

		return newProduct;
	}

	public async update(id: string, newProductData: NewProductI): Promise<ProductI | null> {
		const searchedProductIndex = await this.findIndex(id);

		if (searchedProductIndex === -1) {
			return null;
		}

		let productToUpdate = this.products[searchedProductIndex];

		const updatedProduct = { ...productToUpdate, ...newProductData };

		this.products.splice(searchedProductIndex, 1, updatedProduct);

		return updatedProduct;
	}

	public async delete(id: string): Promise<null | undefined> {
		const searchedProductIndex = this.products.findIndex((el: ProductI) => el._id === id);

		if (searchedProductIndex === -1) {
			return null;
		}

		this.products = this.products.filter((el: ProductI) => el._id !== id);
		return;
	}
}
