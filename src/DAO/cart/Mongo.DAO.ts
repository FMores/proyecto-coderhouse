import { CartMethodsDAO, PersistenceType } from '../../config/interfaces';
import { mongoConnection } from '../../services/MongoDB';
import mongodbCartModel from '../../models/mongo.cart.model';
import mongodbProductModel from '../../models/mongo.prod.model';

// Harcoded userId = '628c290ebeed9a7b4df6b722';

export class CartMongoDAO implements CartMethodsDAO<any> {
	private cart: any;
	private product: any;

	constructor() {
		this.cart = mongodbCartModel;
		this.product = mongodbProductModel;
	}

	private async checkId(id: string): Promise<any> {
		if (id.toString().match(/^[a-fA-F0-9]{24}$/)) {
			return true;
		}
		return false;
	}

	public async get(id?: string): Promise<any> {
		if (id) {
			const checkId = await this.checkId(id);
			if (!checkId) {
				return 'Invalid user id';
			}
			const cartByUserId = await this.cart.find({ userId: id }); //.populate('items.productId');
			return cartByUserId;
		}

		const listOfCart = await this.cart.find();
		return listOfCart;
	}

	public async add(id: string, id_prod: string): Promise<any> {
		const resultCheckId = await this.checkId(id);
		const resultCheckId_prod = await this.checkId(id_prod);

		//Chequeo que los dos id ingresados sean del tipo que mongo acepta.
		if (!resultCheckId || !resultCheckId_prod) {
			return !resultCheckId ? 'Invalid user id' : 'Invalid product id';
		}

		//Verifico que el producto a agregar exista en la tabla de productos.
		const productDataFromDb = await this.product.find({ _id: id_prod });

		if (productDataFromDb.length === 0) {
			return 'Product Not Found';
		}

		//Si el id de usuario pasa la validacion, busco el carro que pertenece a ese user id
		const currentCart = await this.get(id);

		let productInCart: any;

		//Si el carrito tiene valores, busco si el producto nuevo ya existe.
		if (currentCart.length > 0) {
			//Verifico si el carrito ya tiene el producto. Si tiene, procedo a actualizar los campos sumando un producto.
			productInCart = currentCart[0].items.filter((el: any) => el.productId.toString() === id_prod);
		}

		if (currentCart.length > 0 && productInCart.length > 0) {
			const cartUpdated = await this.cart.findOneAndUpdate(
				{ userId: id, 'items.productId': id_prod },
				{
					$set: {
						'items.$.quantity': productInCart[0].quantity + 1,
						quantity: currentCart[0].quantity + 1,
						subTotal: currentCart[0].subTotal + productDataFromDb[0].price,
					},
				},
				{ new: true },
			);

			cartUpdated.save();

			return cartUpdated;
		}

		//Si el producto no existe en el carrito, lo agrego.
		if (currentCart.length > 0 && productInCart.length === 0) {
			const cartAddingProduct = await this.cart.findOneAndUpdate(
				{ userId: id },
				{
					$set: { quantity: 1, subTotal: productDataFromDb[0].price },
					$push: { items: { productId: id_prod, quantity: 1 } },
				},
				{ new: true },
			);

			cartAddingProduct.items.quantity = cartAddingProduct.items.quantity + 1;

			return cartAddingProduct;
		}

		//Creo el carrito en caso de que ninguna de las condiciones anteriores se cumplen
		const newCart = {
			status: true,
			userId: id,
			items: { productId: id_prod, quantity: 1 },
			quantity: 1,
			subTotal: productDataFromDb[0].price,
		};

		const cart = new this.cart(newCart);

		await cart.save();

		return cart;
	}

	public async delete(id: string, id_prod: string): Promise<any> {
		//Verifica que los id sean validos para mongo
		const resultCheckId = await this.checkId(id);
		const resultCheckId_prod = await this.checkId(id_prod);

		if (!resultCheckId || !resultCheckId_prod) {
			return !resultCheckId ? 'Invalid user id' : 'Invalid product id';
		}

		//Busco si hay un carrito asignado al id del usuario
		const currentCart = await this.get(id);

		let searchedProduct: any;

		//Si existe el carrito, busco si ya cuenta con el producto.
		if (currentCart.length > 0) {
			searchedProduct = currentCart[0].items.filter((el: any) => el.productId.toString() === id_prod);
		}

		//Si el carrito tiene el producto, actualizo eliminando uno. Si no existe, termino la funcion.
		if (searchedProduct.length > 0) {
			const productData = await this.cart.findOne({}, { userId: id }).populate('items.productId');

			const product = productData.items.filter((el: any) => el.productId._id.toString() === id_prod);

			const cartUpdated = await this.cart.findOneAndUpdate(
				{ userId: id, 'items.productId': id_prod },
				{
					$set: {
						'items.$.quantity': searchedProduct[0].quantity - 1,
						quantity: currentCart[0].quantity - 1,
						subTotal: currentCart[0].subTotal - product[0].productId.price,
					},
				},
			);

			cartUpdated.save();
		} else {
			return 'Product Not Found';
		}

		//Esta linea sirve para eliminar el producto del array cuando detecta que ya se elimino el ultimo.
		if (searchedProduct.length > 0 && searchedProduct[0].quantity === 1) {
			const cartUpdated = await this.cart.updateOne(
				{ userId: id },
				{
					$pull: { items: { productId: id_prod } },
				},
			);
		}
	}
}
