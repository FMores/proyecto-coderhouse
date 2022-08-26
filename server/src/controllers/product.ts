import { Request, Response } from 'express';
import { ProductI } from '../config/interfaces';
import { logger } from '../utils/winston.logger';
import { product_API } from '../API/product';

class ProductController {
	public async get(req: Request, res: Response): Promise<void> {
		const { id } = req.params;

		const dataReceived = await product_API.get(id);

		if (dataReceived.length === 0) {
			res.status(404).send({ status: 'Not Found' });
			return;
		}

		res.status(200).send({ products: dataReceived });

		return;
	}

	public async add(req: Request, res: Response): Promise<void> {
		const productAdded = await product_API.add(req.body);

		res.status(200).send({ status: 'Product added successfully', product: productAdded });
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { id } = req.params;

		const updatedResult = await product_API.update(id, req.body);

		if (updatedResult) {
			res.status(200).send({ status: 'Product updated successfully', product: updatedResult });
			return;
		}
		res.status(404).send({ status: 'Not Found' });
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { id } = req.params;

		const daleteResult = await product_API.delete(id);

		if (daleteResult === null) {
			res.status(404).send({ status: 'Not Found' });
			return;
		}
		res.status(200).send({ status: 'Product delete successfully' });
		return;
	}

	public async socketGet(): Promise<ProductI[] | undefined> {
		try {
			const dataReceived = await product_API.get();

			return dataReceived;
		} catch (err: any) {
			logger.error(`Prod_controller socketGet() error: ${err.message}`);
		}
	}

	public async socketAdd(new_prod_data: ProductI): Promise<void> {
		try {
			await product_API.add(new_prod_data);
		} catch (err: any) {
			logger.error(`Prod_controller socketAdd() error: ${err.message}`);
		}
	}
}

export const product_controller = new ProductController();
