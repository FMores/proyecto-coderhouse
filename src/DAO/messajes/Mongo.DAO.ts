import { IMessage, PersistenceType } from '../../config/interfaces';
import mongodbMessageModel from '../../models/mongo.msg.model';
import { mongoConnection } from '../../services/MongoDB';
import { date_creator } from '../../utils/date';

export class MsgMongoDAO {
	private msg: any;

	constructor(public persistence: PersistenceType) {
		this.msg = mongodbMessageModel;
	}

	public async get() {
		return await this.msg.find();
	}

	public async add(msg_data: IMessage) {
		const date = await date_creator();

		const msgToSave = {
			author: {
				email: msg_data.email,
				name: msg_data.name,
				surname: msg_data.surname,
				age: msg_data.age,
				alias: msg_data.alias,
				avatar: msg_data.avatar,
			},
			text: msg_data.text,
			timestamp: date,
		};

		const newMsg = new this.msg(msgToSave);

		await newMsg.save();
	}
}
