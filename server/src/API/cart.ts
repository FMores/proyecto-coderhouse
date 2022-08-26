import { CartMethodsDAO, NewProductI, PersistenceType } from '../config/interfaces';
import { CartFactoryDAO } from '../DAO/cart/Factory';

class CartAPI {
	private cart: CartMethodsDAO<any>;

	constructor() {
		this.cart = CartFactoryDAO.get(PersistenceType.Mongo_Atlas);
	}

	public async get(id?: string): Promise<any> {
		return await this.cart!.get(id);
	}

	public async add(id: string, id_prod: string, newData: NewProductI): Promise<any> {
		return await this.cart!.add(id, id_prod, newData);
	}

	public async delete(id: string, id_prod: string): Promise<any> {
		return await this.cart!.delete(id, id_prod);
	}
}

export const cartAPI = new CartAPI();
