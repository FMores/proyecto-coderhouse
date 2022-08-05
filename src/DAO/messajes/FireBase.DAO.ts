import { fireBaseConnection } from '../../services/FireBase';
import { IMessage } from '../../config/interfaces';
import { date_creator } from '../../utils/date';

export class FireBaseMsgDAO {
	private db: any;
	private collection: any;

	constructor() {
		(this.db = fireBaseConnection()), (this.collection = this.db.collection('messages'));
	}

	public async get() {
		const snapshot = await this.collection.orderBy('timestamp').get();
		const docs = snapshot.docs;
		const msgList = docs.map((aDocs: any) => ({
			_id: aDocs.id,
			...aDocs.data(),
		}));

		return msgList;
	}

	public async add(msg_data: IMessage) {
		const date = await date_creator();

		const msgToSave = {
			author: {
				id: msg_data.email,
				name: msg_data.name,
				surname: msg_data.surname,
				age: msg_data.age,
				alias: msg_data.alias,
				avatar: msg_data.avatar,
			},
			text: msg_data.text,
			timestamp: date,
		};

		await this.collection.add(msgToSave);

		return;
	}
}
