import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { new_product, update_product } from '../models/joi.schemas';
import { product_controller } from '../controllers/product';
import { validator } from '../middleware/joi.validator';
import { isLoggedIn } from '../middleware/passport.auth';

const router = Router();

// GET: '/:id?' - Me permite listar todos los productos disponibles ó un producto por su id (disponible para usuarios y administradores)
router.get('/:id?', expressAsyncHandler(product_controller.get));

// POST: '/' - Para incorporar productos al listado (disponible para administradores)
router.post('/', isLoggedIn, validator(new_product), expressAsyncHandler(product_controller.add));

// PUT: '/:id' - Actualiza un producto por su id (disponible para administradores)
router.put('/:id', isLoggedIn, validator(update_product)), expressAsyncHandler(product_controller.update);

// DELETE: '/:id' - Borra un producto por su id (disponible para administradores)
router.delete('/:id', isLoggedIn, expressAsyncHandler(product_controller.delete));

export default router;
