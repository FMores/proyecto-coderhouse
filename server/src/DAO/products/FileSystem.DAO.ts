import { CommonMethodsDAO, NewProductI, ProductI } from '../../config/interfaces';
import { date_creator } from '../../utils/date';
import { code_creator } from '../../utils/uuid';
import fs from 'fs/promises';

const userId = '628c290ebeed9a7b4df6b722';

export class FileSystemDAO implements CommonMethodsDAO {
	private filePath: string;

	constructor(fileLocation: string) {
		this.filePath = fileLocation;
	}

	private async fileStat(): Promise<import('fs').Stats> {
		const fileStats = await fs.stat(this.filePath);
		if (fileStats.size === 0) {
			await fs.writeFile(this.filePath, JSON.stringify([]));
			const fileInitialized = await fs.stat(this.filePath);
			return fileInitialized;
		}
		return fileStats;
	}

	private async readFile(): Promise<any> {
		await this.fileStat();
		const dataStr = await fs.readFile(this.filePath, 'utf8');
		const dataObj = JSON.parse(dataStr);
		return dataObj;
	}

	private async writeFile(data: ProductI[]): Promise<void> {
		await fs.writeFile(this.filePath, JSON.stringify(data, null, '\t'));
	}

	public async get(id?: string): Promise<ProductI[]> {
		if (!id) {
			await this.fileStat();
			const currentProducList = await this.readFile();

			if (currentProducList.length > 0) {
				return currentProducList;
			} else {
				return [];
			}
		} else {
			await this.fileStat();
			const currentDataList = await this.readFile();
			const productById = currentDataList.filter((e: ProductI) => e._id === id);
			if (productById.length > 0) {
				return productById[0];
			} else {
				return [];
			}
		}
	}

	public async add(newProductData: NewProductI): Promise<ProductI> {
		const stats = await this.fileStat();
		const timestamp = await date_creator();
		const productId = await code_creator();
		const productCode = await code_creator();

		if (stats.size > 2) {
			const currentProductList = await this.readFile();
			const newProduct = {
				_id: `PID-${productId}`,
				code: `PC-${productCode}`,
				timestamp,
				...newProductData,
			};

			currentProductList.push(newProduct);

			await this.writeFile(currentProductList);

			return newProduct;
		} else {
			const initialProduct = {
				_id: `PID-${productId}`,
				code: `PC-${productCode}`,
				timestamp,
				...newProductData,
			};

			const initialArrayOfProducts = [initialProduct];

			await this.writeFile(initialArrayOfProducts);

			return initialProduct;
		}
	}

	public async update(id: string, newProductData: NewProductI): Promise<ProductI | null> {
		await this.fileStat();

		const currentProductList = await this.readFile();

		const searchedProductIndex = currentProductList.findIndex((el: ProductI) => el._id === id);

		if (searchedProductIndex === -1) {
			return null;
		}

		let productToUpdate = currentProductList[searchedProductIndex];

		const updatedProduct = { ...productToUpdate, ...newProductData };

		currentProductList.splice(searchedProductIndex, 1, updatedProduct);

		await this.writeFile(currentProductList);

		return updatedProduct;
	}

	public async delete(id: string): Promise<null | undefined> {
		const currentProductList = await this.readFile();

		const searchedProductIndex = currentProductList.findIndex((el: ProductI) => el._id === id);

		if (searchedProductIndex === -1) {
			return null;
		}

		const filteredProductList = currentProductList.filter((e: ProductI) => e._id !== id);

		await this.writeFile(filteredProductList);
	}
}
