import { Knex } from 'knex';

// Configuracion para inicializar las tablas en la DB
// Para cargar las tablas a la DB => npx knex migrate:latest
// Si se lo ejecuta mas de una vez, este resetea la labla a cuando se origino por primera vez.

export const up = async (knex: Knex): Promise<void> => {
	try {
		await knex.schema.createTable('products', (prod_table) => {
			prod_table.increments('_id');
			prod_table.string('title').notNullable();
			prod_table.decimal('price', 12, 3);
			prod_table.integer('stock').notNullable();
			prod_table.string('thumbnail').notNullable();
			prod_table.timestamp('createdAt').defaultTo(knex.fn.now());
		});
	} catch (err: any) {
		throw Error(err.message);
	}
};

// Configuracion para borrar las tablas en la DB
// Para eliminar las tablas => npx knex migrate:rollback

export const down = async (knex: Knex): Promise<void> => {
	try {
		await knex.schema.dropTable('products');
	} catch (err: any) {
		throw Error(err);
	}
};
