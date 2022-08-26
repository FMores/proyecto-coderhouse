import { CartMethodsDAO, PersistenceType } from '../../config/interfaces';
import { sqlConnection } from '../../services/SQL';

// NO ESTA TERMINADO!!

export class Sqlite3CartDAO implements CartMethodsDAO<any> {
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

			const existTable = await this.db.schema.hasTable('carts');
			if (!existTable) {
				await this.db.schema.createTable('carts', (cartTable: any) => {
					cartTable.increments('cart_id').primary();
					cartTable.Boolean('status').notNullable();
					cartTable.string('userId').notNullable().require;
					cartTable.string('items').notNullable();
					cartTable.Number('quantity').notNullable();
					cartTable.number('subTotal').notNullable();
					cartTable.timestamp('timestamp').defaultTo(this.db.fn.now());
				});
			}
		} catch (err: any) {
			throw Error(err.message);
		}
	}

	public async get(id?: string): Promise<any> {
		return [];
	}

	public async add(id: string, id_prod: string): Promise<any> {
		return [];
	}

	public async delete(id: string, id_prod: string): Promise<any> {
		return [];
	}
}
