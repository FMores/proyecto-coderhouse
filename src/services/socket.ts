import io, { Server as ioServer } from 'socket.io';
import { Server as httpServer } from 'http';
import { logger } from '../utils/winston.logger';
import { product_controller } from '../controllers/product';
import { message_controller } from '../controllers/message';

//Datos utiles

//Para responder a un solo cliente => socket.emit('peticion', respuesta)
//Para responder a todos => this.ioServer.emit('peticion', respuesta)
//Para responder a todos menos al que envia el mensaje => socket.broadcast.emit('peticion', respuesta)

class IoService {
	private ioServer: ioServer | undefined;

	init = (httpServer: httpServer) => {
		logger.info('Starting socket connection');
		if (this.ioServer) {
			logger.info('A socket connection is already established.');
		} else {
			this.ioServer = new io.Server(httpServer);

			this.ioServer.on('connection', async (socket) => {
				// Chat-Room
				socket.emit('mensajes', await message_controller.get());
				socket.on('new-msg', async (data) => {
					await message_controller.add(data);
					this.ioServer?.emit('mensajes', await message_controller.get());
				});
				// Produc List
				socket.emit('product-list', await product_controller.socketGet());
				socket.on('new_product', async (data) => {
					await product_controller.socketAdd(data);
					this.ioServer?.emit('product-list', await product_controller.socketGet());
				});
			});
		}
	};
}

export const ioService = new IoService();
