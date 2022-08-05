import { CartMethodsDAO, PersistenceType, NewProductI } from '../../config/interfaces';
import { sqlConnection } from '../../services/SQL';
import { logger } from '../../utils/winston.logger';

// NO ESTA TERMINADO!!

export class MysqlCartDAO implements CartMethodsDAO<any> {
	private db: any;
	persistence: PersistenceType;
	private tableName: string;

	constructor(persistence: PersistenceType) {
		this.persistence = persistence;
		this.connection();
		this.tableName = 'carts';
	}

	private async connection(): Promise<void> {
		try {
			this.db = await sqlConnection(this.persistence);

			const existTable = await this.db.schema.hasTable(this.tableName);
			if (!existTable) {
				await this.db.schema.createTable('carts', (cartTable: any) => {
					cartTable.increments('cart_id').primary();
					cartTable.string('user_id').notNullable();
					cartTable.string('product_id').notNullable().unsigned().references('_id').inTable('products');
					cartTable.timestamp('timestamp').defaultTo(this.db.fn.now());
				});
			}
		} catch (err: any) {
			logger.error(err.message);
		}
	}

	public async get(id?: string): Promise<any> {
		if (id) {
			const cartById = await this.db.select('*').from('carts', 'products');

			return cartById;
		}
		const cart = await this.db(this.tableName);
		return cart;
	}

	public async add(id: string, id_prod: string, newData: NewProductI): Promise<any> {
		await this.db(this.tableName).insert(newData).where({ user_id: id });
		return [];
	}

	public async delete(id: string, id_prod: string): Promise<any> {
		return [];
	}
}
