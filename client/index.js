import axios from 'axios';
import logSymbols from 'log-symbols';

class Test {
	static async init() {
		console.log('##########  INICIANDO TEST ##########');
		console.log('');
		console.log('----- GET => /api/productos -----');

		/*----------------------------------------------------*/
		/* --------------------- TEST 1 --------------------- */
		/*----------------------------------------------------*/
		const resultGetAll = await axios.get('http://localhost:8080/api/productos');
		const allProducts = resultGetAll.data.products;

		if (allProducts && allProducts.length > 0) {
			console.log(` ${logSymbols.success} Debe retornar un array de productos`);
		} else {
			console.log(` ${logSymbols.error} Debe retornar un array de productos`);
		}

		/*----------------------------------------------------*/
		/* --------------------- TEST 2 --------------------- */
		/*----------------------------------------------------*/
		const randomProductId = allProducts[Math.floor(Math.random() * allProducts.length)];

		try {
			const resultGetById = await axios.get(
				`http://localhost:8080/api/productos/${randomProductId._id}`,
			);

			const prodById = resultGetById.data.products;

			if (prodById && prodById._id == randomProductId._id) {
				console.log(` ${logSymbols.success} Debe retornar un producto buncando por ID`);
			}
		} catch (error) {
			console.log(` ${logSymbols.error} Debe retornar un producto buncando por ID`);
		}
	}
}

Test.init();
