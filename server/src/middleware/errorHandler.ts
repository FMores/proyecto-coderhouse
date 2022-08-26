import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { logger } from '../utils/winston.logger';

export const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	const status = err.status || 500;

	const message = err.message || 'Something went wrong';

	if (!req.route) {
		logger.warn(`Method:${req.method}, Route:${req.originalUrl}, ${err.message} `);
		res.status(status).send({ status, message });
		return;
	}

	res.status(status).send({ status, message });
};
