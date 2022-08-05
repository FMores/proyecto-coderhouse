import { CartMethodsDAO, NewProductI } from '../../config/interfaces';
import { date_creator } from '../../utils/date';
import { code_creator } from '../../utils/uuid';

export class MemoryCartDAO implements CartMethodsDAO<any> {
	private cart: any[] = [];

	// Harcoded userId = '628c290ebeed9a7b4df6b722';

	constructor() {
		const mockData = {
			state: true,
			_id: 'f6112378-3952-456d-8836-8a468f569310',
			userId: '628c290ebeed9a7b4df6b722',
			timestamp: '29-05-22 08:13:09 pm',
			items: [],
			quantity: 0,
			subTotal: 0,
		};
		this.cart.push(mockData);
	}

	private async checkId(id: string): Promise<boolean> {
		const cartByUserId = this.cart.filter((el: any) => el.userId === id);

		if (cartByUserId.length === 0) {
			return false;
		}

		return true;
	}

	public async get(id?: string): Promise<any> {
		if (!id) {
			if (this.cart.length === 0) {
				return '1';
			}

			return this.cart;
		}

		const existId = await this.checkId(id);

		if (existId) {
			const cartByUserId = this.cart.filter((el: any) => el.userId === id);

			return cartByUserId;
		}

		return 'Not Found';
	}

	public async add(id: string, id_prod: string, newProductData: NewProductI): Promise<any> {
		const cartId = await code_creator();
		const timestamp = await date_creator();

		if (this.cart.length === 0 || !(await this.checkId(id))) {
			const newCart = {
				state: true,
				_id: cartId,
				userId: id,
				timestamp,
				items: [
					{
						_id: id_prod,
						name: newProductData.name,
						price: newProductData.price,
						quantity: 1,
						timestamp,
					},
				],
				quantity: 1,
				subTotal: newProductData.price,
			};

			this.cart.push(newCart);

			return newCart.items[0];
		}

		const cartIndex = this.cart.findIndex((el: any) => el.userId === id);

		const cartByUserId = this.cart.filter((el: any) => el.userId === id);

		const productExist = cartByUserId[0].items.filter((el: any) => el._id === id_prod);

		if (productExist.length === 1) {
			productExist[0].quantity = productExist[0].quantity + 1;

			cartByUserId[0].quantity = cartByUserId[0].quantity + 1;

			cartByUserId[0].subTotal = cartByUserId[0].subTotal + newProductData.price;

			this.cart.splice(cartIndex, 1, ...cartByUserId);

			return productExist[0];
		}

		const productToAdd = {
			_id: id_prod,
			name: newProductData.name,
			price: newProductData.price,
			quantity: 1,
			timestamp,
		};

		cartByUserId[0].items.push(productToAdd);

		cartByUserId[0].quantity = cartByUserId[0].quantity + 1;

		cartByUserId[0].subTotal = cartByUserId[0].subTotal + newProductData.price;

		this.cart.splice(cartIndex, 1, ...cartByUserId);

		return productToAdd;
	}

	public async delete(id: string, id_prod: string): Promise<any> {
		const existId = await this.checkId(id);

		if (!existId) {
			return 'Not Found or Invalid user id';
		}

		const userIndex = this.cart.findIndex((el: any) => el.userId === id);

		const productIndex = this.cart[userIndex].items.findIndex((el: any) => el._id === id_prod);

		if (!this.cart[userIndex].items[productIndex] || this.cart[userIndex].items === 0) {
			return 'Not Found or Invalid product id';
		}

		if (this.cart[userIndex].items[productIndex].quantity > 0) {
			this.cart[userIndex].items[productIndex].quantity = this.cart[userIndex].items[productIndex].quantity - 1;

			this.cart[userIndex].quantity = this.cart[userIndex].quantity - 1;

			this.cart[userIndex].subTotal = this.cart[userIndex].subTotal - this.cart[userIndex].items[productIndex].price;

			if (this.cart[userIndex].items[productIndex].quantity === 0) {
				const itemsFiltered = this.cart[userIndex].items.filter((el: any) => el._id !== id_prod);

				this.cart[userIndex].items = itemsFiltered;

				return;
			}
			this.cart;
			return;
		}

		return '3';
	}
}
