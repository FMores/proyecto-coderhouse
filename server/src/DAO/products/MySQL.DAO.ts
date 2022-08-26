import { CommonMethodsDAO, NewProductI, PersistenceType, ProductI } from '../../config/interfaces';
import { sqlConnection } from '../../services/SQL';
import { logger } from '../../utils/winston.logger';

export class MysqlDAO implements CommonMethodsDAO {
	private db: any;
	persistence: PersistenceType;
	private tableName: string;

	constructor(persistence: PersistenceType) {
		this.persistence = persistence;
		this.connection();
		this.tableName = 'products';
	}

	private async connection(): Promise<void> {
		try {
			this.db = await sqlConnection(this.persistence);

			const existTable = await this.db.schema.hasTable('products');

			if (!existTable) {
				await this.db.schema.createTable('products', (prodTable: any) => {
					prodTable.increments('_id').primary();
					prodTable.string('name').notNullable();
					prodTable.string('description').notNullable();
					prodTable.decimal('price', 12, 3).notNullable();
					prodTable.integer('stock').notNullable();
					prodTable.string('thumbnail').notNullable();
					prodTable.timestamp('timestamp').defaultTo(this.db.fn.now());
				});
			}
		} catch (err: any) {
			logger.info(`Something went wrong: ${err}`);
		}
	}

	public async get(id?: string): Promise<ProductI[]> {
		if (id) {
			const productById = await this.db(this.tableName).where('_id', id);

			if (productById.length && productById[0]._id === Number(id)) {
				return productById;
			}
			return [];
		}

		const currentProducts = await this.db(this.tableName);
		return currentProducts;
	}

	public async add(newProductData: NewProductI): Promise<ProductI> {
		const newProduct = await this.db(this.tableName).insert(newProductData);

		const savedProduct = await this.get(newProduct[0]);

		return savedProduct[0];
	}

	public async update(id: string, newProductData: NewProductI): Promise<ProductI | null> {
		if (!id.match('^[0-9]+$')) {
			return null;
		}

		const resultUpdate = await this.db(this.tableName).where('_id', id).update(newProductData);
		if (resultUpdate === 0) {
			return null;
		}
		const updatedProduct = await this.get(id);
		return updatedProduct[0];
	}

	public async delete(id: string): Promise<null | undefined> {
		if (!id.match('^[0-9]+$')) {
			return null;
		}

		const resultDelete = await this.db(this.tableName).where('_id', id).del();

		if (resultDelete === 1) {
			return;
		}
		return null;
	}
}
