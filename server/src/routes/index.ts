import { Router } from 'express';
import product_router from './product';
import cart_router from '../routes/cart';
import auth_router from './auth';
import home_router from './home';

const router = Router();

router.use('/home', home_router);
router.use('/productos', product_router);
router.use('/cart', cart_router);
router.use('/auth', auth_router);

export default router;
