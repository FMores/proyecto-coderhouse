import { date_creator } from '../../utils/date';
import { code_creator } from '../../utils/uuid';
import fs from 'fs/promises';
import { CartMethodsDAO, NewProductI } from '../../config/interfaces';

export class CartFileSystemDAO implements CartMethodsDAO<any> {
	private filePath: string;

	// Harcoded userId = '628c290ebeed9a7b4df6b722';

	constructor(fileLocation: any) {
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

	private async readFile(): Promise<Array<any>> {
		await this.fileStat();
		const dataStr = await fs.readFile(this.filePath, 'utf8');
		const dataObj = JSON.parse(dataStr);
		return dataObj;
	}

	private async writeFile(data: any): Promise<void> {
		await fs.writeFile(this.filePath, JSON.stringify(data, null, '\t'));
	}

	private async checkId(id: string): Promise<boolean> {
		const cartList = await this.readFile();

		const cartByUserId = cartList.filter((el: any) => el.userId === id);

		if (cartByUserId.length === 0) {
			return false;
		}

		return true;
	}

	public async get(id?: string): Promise<any> {
		await this.fileStat();

		if (!id) {
			const cartData = await this.readFile();

			if (cartData.length === 0) {
				return 'Not Found';
			}

			return cartData;
		}

		const existId = await this.checkId(id);

		if (existId) {
			const cartList = await this.readFile();

			const cartByUserId = cartList.filter((el: any) => el.userId === id);

			return cartByUserId;
		}

		return 'Invalid user id';
	}

	public async add(id: string, id_prod: string, newProductData?: NewProductI): Promise<any> {
		const dbStats = await this.fileStat();
		const cartId = await code_creator();
		const timestamp = await date_creator();

		if (dbStats.size === 2 || !(await this.checkId(id))) {
			const newCart = {
				state: true,
				_id: cartId,
				userId: id,
				timestamp,
				items: [
					{
						_id: id_prod,
						name: newProductData!.name,
						price: newProductData!.price,
						quantity: 1,
						timestamp,
					},
				],
				quantity: 1,
				subTotal: newProductData!.price,
			};

			const currentCarts = await this.readFile();

			currentCarts.push(newCart);

			await this.writeFile(currentCarts);

			return newCart.items[0];
		}

		const cartList = await this.readFile();

		const cartIndex = cartList.findIndex((el: any) => el.userId === id);

		const cartByUserId = cartList.filter((el: any) => el.userId === id);

		const productExist = cartByUserId[0].items.filter((el: any) => el._id === id_prod);

		if (productExist.length === 1) {
			productExist[0].quantity = productExist[0].quantity + 1;

			cartByUserId[0].quantity = cartByUserId[0].quantity + 1;

			cartByUserId[0].subTotal = cartByUserId[0].subTotal + newProductData!.price;

			cartList.splice(cartIndex, 1, ...cartByUserId);

			await this.writeFile(cartList);

			return productExist[0];
		}

		const productToAdd = {
			_id: id_prod,
			name: newProductData!.name,
			price: newProductData!.price,
			quantity: 1,
			timestamp,
		};

		cartByUserId[0].items.push(productToAdd);

		cartByUserId[0].quantity = cartByUserId[0].quantity + 1;

		cartByUserId[0].subTotal = cartByUserId[0].subTotal + newProductData!.price;

		cartList.splice(cartIndex, 1, ...cartByUserId);

		await this.writeFile(cartList);

		return productToAdd;
	}

	public async delete(id: string, id_prod: string): Promise<any> {
		await this.fileStat();
		const existId = await this.checkId(id);

		if (!existId) {
			return 'Not Found user id';
		}

		const cartList = await this.readFile();

		const userIndex = cartList.findIndex((el: any) => el.userId === id);

		const productIndex = cartList[userIndex].items.findIndex((el: any) => el._id === id_prod);

		if (!cartList[userIndex].items[productIndex] || cartList[userIndex].items === 0) {
			return 'Not Found product id';
		}

		if (cartList[userIndex].items[productIndex].quantity > 0) {
			cartList[userIndex].items[productIndex].quantity = cartList[userIndex].items[productIndex].quantity - 1;

			cartList[userIndex].quantity = cartList[userIndex].quantity - 1;

			cartList[userIndex].subTotal = cartList[userIndex].subTotal - cartList[userIndex].items[productIndex].price;

			if (cartList[userIndex].items[productIndex].quantity === 0) {
				const itemsFiltered = cartList[userIndex].items.filter((el: any) => el._id !== id_prod);

				cartList[userIndex].items = itemsFiltered;

				await this.writeFile(cartList);
				return;
			}

			await this.writeFile(cartList);
			return;
		}

		return '3';
	}
}
