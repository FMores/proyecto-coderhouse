import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/winston.logger';

export const validator = (schema: { validateAsync: (arg0: any) => any }) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { error } = await schema.validateAsync(req.body);
			const valid = error == null;
			if (valid) {
				next();
			} else {
				const { details } = error;
				logger.error(details);
			}
		} catch (error: any) {
			logger.error(`Validator midd error: ${error}`);
			res.render('joiError');
		}
	};
};
