import axios from 'axios';
import logSymbols from 'log-symbols';
import { faker } from '@faker-js/faker';

const URL = 'http://localhost:8080/api/productos/';

class Test {
	static async init() {
		console.log('##########  INICIANDO TEST ##########');
		console.log('');
		console.log('----- GET => /api/productos -----');

		/*------------------------------------------------------*/
		/* --------------------- TEST 1.1 --------------------- */
		/*------------------------------------------------------*/
		let allProducts = null;
		let randomProductId = null;

		try {
			const resultGetAll = await axios.get(URL, { withCredentials: true });
			allProducts = resultGetAll.data.products;

			randomProductId = allProducts[Math.floor(Math.random() * allProducts.length)];

			if (allProducts && allProducts.length > 0) {
				console.log(` ${logSymbols.success} Debe retornar un array de productos`);
			} else {
				console.log(` ${logSymbols.error} Debe retornar un array de productos`);
			}
		} catch (err) {
			console.log(`Test 1.1 broken:${err.message}`);
		}

		/*------------------------------------------------------*/
		/* --------------------- TEST 1.2 --------------------- */
		/*------------------------------------------------------*/

		try {
			const resultGetById = await axios.get(`${URL}${randomProductId._id}`, {
				withCredentials: true,
			});

			const prodById = resultGetById.data.products;

			if (prodById && prodById._id == randomProductId._id) {
				console.log(` ${logSymbols.success} Debe retornar un producto buncando por ID`);
			} else {
				console.log(` ${logSymbols.error} Debe retornar un producto buncando por ID`);
			}
		} catch (err) {
			console.log(`Test 1.2 broken:${err.message}`);
		}

		/*------------------------------------------------------*/
		/* --------------------- TEST 2.0 --------------------- */
		/*------------------------------------------------------*/
		console.log('');
		console.log('----- POST => /api/productos/:id -----');

		try {
			const mockProduct = {
				name: faker.commerce.productName(),
				price: Number(faker.commerce.price()),
				thumbnail: faker.image.technics(),
			};

			const resultPost = await axios.post(URL, mockProduct, { withCredentials: true });
			const productAdded = resultPost.data.product;

			Object.keys(mockProduct).forEach((key) => {
				if (productAdded[key] !== mockProduct[key]) {
					throw 'break';
				}
			});

			console.log(` ${logSymbols.success} Debe agregar un producto y retornarlo`);
		} catch (err) {
			err === 'break'
				? console.log(` ${logSymbols.error} Debe agregar un producto y retornarlo`)
				: console.log(`Test 2.0 broken:${err.message}`);
		}

		/*------------------------------------------------------*/
		/* --------------------- TEST 3.0 --------------------- */
		/*------------------------------------------------------*/
		console.log('');
		console.log('----- PUT => /api/productos/:id -----');

		try {
			const mockProd = {
				name: faker.commerce.productName(),
			};

			const resultPut = await axios.put(`${URL}${randomProductId._id}`, mockProd, {
				withCredentials: true,
			});
			const productUpdated = resultPut.data.product;

			Object.keys(mockProd).forEach((key) => {
				if (productUpdated[key] !== mockProd[key]) {
					throw 'break';
				}
			});

			console.log(
				` ${logSymbols.success} Actualiza datos de un producto en particular pasando el ID`,
			);
		} catch (err) {
			err === 'break'
				? console.log(
						` ${logSymbols.error} Actualiza datos de un producto en particular pasando el ID`,
				  )
				: console.log(`Test 3.0 broken:${err.message}`);
		}

		/*------------------------------------------------------*/
		/* --------------------- TEST 4.0 --------------------- */
		/*------------------------------------------------------*/
		console.log('');
		console.log('----- DELETE => /api/productos/:id -----');

		try {
			await axios.delete(`${URL}${randomProductId._id}`, { withCredentials: true });

			const resultDelete = await axios.get(URL, {
				withCredentials: true,
			});
			const productDelete = resultDelete.data.products;

			const existProductDelete = productDelete.filter((el) => el._id === randomProductId);

			if (existProductDelete.length !== 0) {
				console.log(` ${logSymbols.error} Elimina un producto de la lista por du ID`);
			}
			console.log(` ${logSymbols.success} Elimina un producto de la lista por du ID`);
		} catch (err) {
			console.log(`Test 4.0 broken:${err.message}`);
		}
	}
}

Test.init();
