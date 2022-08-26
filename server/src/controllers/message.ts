import { IMessage } from '../config/interfaces';
import { msg_api } from '../API/message';

class MsgController {
	public async get() {
		return await msg_api.get();
	}

	public async add(new_msg: IMessage): Promise<void> {
		await msg_api.add(new_msg);
	}
}

export const message_controller = new MsgController();
