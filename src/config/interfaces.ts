export interface NewProductI {
	_id?: string;
	name: string;
	price: number;
	thumbnail: string;
	timestamp?: string;
}

export interface ProductI {
	_id: string;
	name: string;
	price: number;
	thumbnail: string;
	timestamp?: string;
}

export interface CommonMethodsDAO {
	get(id?: string): Promise<ProductI[]>;
	add(data: NewProductI): Promise<ProductI>;
	update(id: string, newProductData: NewProductI): Promise<ProductI | null>;
	delete(id: string): Promise<null | undefined>;
}

export interface CartMethodsDAO<T> {
	get(id?: string): Promise<T>;
	add(id: string, id_prod: string, newProductData?: NewProductI): Promise<T>;
	delete(id: string, id_prod: string): Promise<T>;
}

export enum PersistenceType {
	Memory = 'Memory',
	FileSystem = 'FSystem',
	MySQL = 'MySQL',
	SQLite3 = 'SQLite3',
	Mongo = 'Mongo',
	Mongo_Atlas = 'Mongo_Atlas',
	FireBase = 'FireBase',
}

export interface CartI {
	userId: string;
	items: [ProductI];
	subTotal: number;
	quantity: number;
	status: boolean;
}

export interface IMessage {
	email: string;
	name: string;
	surname: string;
	age: number;
	alias: string;
	avatar: string;
	text: string;
}

export interface IMail_creator {
	full_name: string;
	adress: string;
	age: number;
	phone_number: string;
	email: string;
}

export interface Imail_content {
	destination: String;
	subject: string;
	content: string;
}
