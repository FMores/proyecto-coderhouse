import { NextFunction, Request, Response } from 'express';
import { EmailService } from '../services/email';
import { cartAPI } from '../API/cart';
import config from '../config';
import { mobile_messaging_service } from '../services/twilio';

class CartController {
	// Harcoded userId = '628c290ebeed9a7b4df6b722';

	public async getAll(req: Request, res: Response, next: NextFunction) {
		const result = await cartAPI.get();

		res.status(200).send({ carts: result });
	}

	public async get(req: Request, res: Response, next: NextFunction) {
		const { id } = req.params;
		const result = await cartAPI.get(id);

		if (typeof result === 'string') {
			res.status(404).send({ status: result });
			return;
		}

		res.status(200).send({ cart: result });
		return;
	}

	public async add(req: Request, res: Response, next: NextFunction) {
		const { id, id_prod } = req.params;

		const result = await cartAPI.add(id, id_prod, req.body);

		if (typeof result === 'string') {
			res.status(404).send({ status: result });
			return;
		}

		res.status(200).send({ newProduct: result });
		return;
	}

	public async delete(req: Request, res: Response, next: NextFunction) {
		const { id, id_prod } = req.params;

		const result = await cartAPI.delete(id, id_prod);

		if (typeof result === 'string') {
			res.status(404).send({ status: result });
			return;
		}

		res.status(200).send({ Status: 'Delete product successfully' });
	}

	public async checkout(req: Request, res: Response, next: NextFunction) {
		if (req.user) {
			const { full_name, email, phone_number } = req.user;

			const contentEmail = `
				<h3>El usuario ${req.user?.email} realizo un nuevo pedido</h3>
				<h4>Detalle del pedido:</h4>
				<h7>${req.body}</h7>
			`;

			const contentSmsAndWsp = `
			Nuevo pedido del usuario ${full_name} - E-mail: ${email}

			Detalle del pedido:
			${req.body}
			`;

			// E-mail al admin mas sms y wsp.
			await EmailService.sendEmail(config.GMAIL_OWNER_ADRESS, `Nuevo pedido del usuario ${full_name} - E-mail: ${email}`, contentEmail);

			await mobile_messaging_service.sendSms(phone_number, contentSmsAndWsp);

			await mobile_messaging_service.sendWsp(phone_number, contentSmsAndWsp);

			// Mensajes por SMS y WSP al usuario/cliente
			await mobile_messaging_service.sendSms(phone_number, contentSmsAndWsp);

			await mobile_messaging_service.sendWsp(phone_number, contentSmsAndWsp);
		}

		res.send({ status: 'ok' });
	}
}

export const cart_controller = new CartController();
