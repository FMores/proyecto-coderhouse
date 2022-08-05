import { Knex } from 'knex';

// Inserta datos por defecto en la tabla que se configure => npx knex seed:run
// Si ejecutamos mas de una vez el comando, solo se actualiza el valor del _id.

export const seed = async (knex: Knex): Promise<void> => {
	const init_products = [
		{
			name: 'cartuchera',
			description: 'cartuchera 2 pisos de cars',
			price: 55,
			stock: 400,
			thumbnail: 'photo-cartuchera-cars',
		},
		{
			name: 'pendrive',
			description: 'Pendrive 8gb',
			price: 20,
			stock: 354,
			thumbnail: 'photo-pendrive-80gb',
		},
	];

	try {
		await knex('products').del();
		await knex('products').insert(init_products);
	} catch (err: any) {
		throw Error(err);
	}
};
