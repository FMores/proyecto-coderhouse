import { httpServer } from '../services/server';
import supertest from 'supertest';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';

let cookie: any;

const request = supertest(httpServer);

describe('POST => "/api/auth/login"', () => {
	it('Deberia loguearse con un usuario existente', (done) => {
		request
			.post('/api/auth/login')
			.send({ email: 'moresfabricio0@gmail.com', password: 'admin' })
			.end((err, res) => {
				if (err) throw new Error(err);
				cookie = res.headers['set-cookie'];
				done();
			});
	});
});

describe('GET => "/api/productos"', () => {
	it('Deberia retornar un array de productos', async () => {
		const { body } = await request.get('/api/productos').expect(200);

		expect(body.products).to.be.an('array');

		body.products.forEach((el: any) => {
			expect(el).to.have.all.keys('_id', 'name', 'price', 'thumbnail', 'timestamp');
		});
	});

	it('Deberia retornar un solo producto (objeto) si buscamos por id', async () => {
		const { body } = await request.get('/api/productos/62fd97197b049e5f915b9997').expect(200);

		expect(body.products).to.be.an('object');
		expect(body.products).to.have.all.keys('_id', 'name', 'price', 'thumbnail', 'timestamp');
	});
});

describe('POST => "/api/productos"', () => {
	it('Deberia incorporar un nuevo producto y devolverlo', async () => {
		const mockProduct: Object = {
			name: faker.commerce.productName(),
			price: Number(faker.commerce.price()),
			thumbnail: faker.image.technics(),
		};

		const { body } = await request
			.post('/api/productos')
			.set('Cookie', cookie)
			.send(mockProduct)
			.expect(200);

		expect(body.product).to.be.an('object');
		expect(body.product).to.have.all.keys('_id', 'name', 'price', 'thumbnail', 'timestamp');
	});
});

describe('PUT => "/api/productos"', () => {
	it('Actualiza datos de un producto en particular pasando el ID', async () => {
		const response = await request.get('/api/productos').expect(200);
		const arrayOfProducts = response.body.products;
		const randomProductId = arrayOfProducts[Math.floor(Math.random() * arrayOfProducts.length)];

		const mockData = {
			name: faker.commerce.productName(),
		};

		const { body } = await request
			.put(`/api/productos/${randomProductId._id}`)
			.set('Cookie', cookie)
			.send(mockData)
			.expect(200);

		const updatedProduct = body.product;

		expect(updatedProduct).to.be.an('object');
		expect(updatedProduct).to.deep.include(mockData);
		expect(updatedProduct).to.have.all.keys('_id', 'name', 'price', 'thumbnail', 'timestamp');
	});
});

describe('DELETE => "/api/productos"', () => {
	it('Elimina un producto de la lista por du ID.', async () => {
		const response = await request.get('/api/productos').expect(200);
		const arrayOfProducts = response.body.products;
		const randomProductId = arrayOfProducts[Math.floor(Math.random() * arrayOfProducts.length)];

		const { body } = await request
			.delete(`/api/productos/${randomProductId._id}`)
			.set('Cookie', cookie)
			.expect(200);
	});
});
