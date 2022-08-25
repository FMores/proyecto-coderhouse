import { httpServer } from '../services/server';
import supertest from 'supertest';
import { expect } from 'chai';

let cookie: any;

const request = supertest(httpServer);

describe('Metodo POST a la ruta "/api/auth/login"', () => {
	it('Deberia loguearse con un usuario existente y crear la cookie', (done) => {
		request
			.post('/api/auth/login')
			.send({ email: 'moresfabricio0@gmail.com', password: 'admin' })
			.end((err, res) => {
				cookie = res.headers['set-cookie'];
				done();
			});
	});
});

describe('Metodo GET en ruta "/api/productos"', () => {
	it('Deberia retornar un array de productos', async () => {
		const { body, status } = await request.get('/api/productos');
		expect(status).to.equal(200);
		expect(body.products).to.be.an('array');
		body.products.forEach((el: any) => {
			expect(el).to.have.all.keys('_id', 'name', 'price', 'thumbnail', 'timestamp');
		});
	});

	// it('Deberia retornar un solo producto (objeto) si buscamos por id', async () => {
	// 	const expected: Object = {
	// 		_id: '62fc5c93efee70c0e3754be3',
	// 		name: 'CAmisaaaaa',
	// 		price: 2324234,
	// 		thumbnail: 'asdfas;fa;sa;sfasf',
	// 		timestamp: '17-08-22 12:12:19 am',
	// 	};
	// 	const { body, status } = await request.get('/api/productos/62fd97197b049e5f915b9997');
	// 	expect(status).to.equal(200);
	// 	expect(body.products).to.deep.equal(expected);
	// });
});

// describe('Metodo POST en ruta "/api/productos"', () => {
// 	it('Deberia incorporar un nuevo product', async () => {
// 		const newProduct: Object = {
// 			name: 'Camisaaaaa',
// 			price: 2324234,
// 			thumbnail: 'asdfas;fa;sa;sfasf',
// 		};

// 		const expected: Object = {
// 			_id: '62fc5c93efee70c0e3754be3',
// 			name: 'CAmisaaaaa',
// 			price: 2324234,
// 			thumbnail: 'asdfas;fa;sa;sfasf',
// 			timestamp: '17-08-22 12:12:19 am',
// 		};

// 		const { body, status } = await request
// 			.post('/api/productos')
// 			.set('Cookie', cookie)
// 			.send(newProduct);

// 		expect(status).to.equal(200);
// 		expect(body.product).to.equal(expected);
// 	});
// });
