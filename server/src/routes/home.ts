import { Router, Request, Response } from 'express';
import { isLoggedIn } from '../middleware/passport.auth';

const router = Router();

router.use('/', isLoggedIn, (req: Request, res: Response) => {
	const uEmail = req.user?.email;
	res.render('index', { uEmail });
});

export default router;
