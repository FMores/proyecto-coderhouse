import { cart_controller } from '../controllers/cart';
import { MySQL_post_schema } from '../models/joi.schemas';
import { validator } from '../middleware/joi.validator';
import { isLoggedIn } from '../middleware/passport.auth';
import { Router } from 'express';

const router = Router();

// Harcoded userId = '628c290ebeed9a7b4df6b722';

// GET: '/' - Me permite listar todos los carritos - solo para admin
router.get('/', isLoggedIn, cart_controller.getAll);

// GET: '/:id/cart' - Me permite listar todos los productos guardados en el carrito pasando el id del usuario
router.get('/:id', cart_controller.get);

// POST: '/:id/cart' - Para incorporar productos al carrito utilizando el id del usuario y el id de producto por params
//router.post('/:id/product/:id_prod', validator(post_schema), cartController.add);

//Para utilizar con SQL
router.post('/:id/product/:id_prod', validator(MySQL_post_schema), cart_controller.add);

// DELETE: '/:id/cart/:id_prod' - Eliminar un producto del carrito utilizando el id del usuario y el id de producto por params
router.delete('/:id/product/:id_prod', cart_controller.delete);

router.post('/checkout', cart_controller.checkout);

export default router;
