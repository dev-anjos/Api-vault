import {Router} from 'express';
import CartController from '../controllers/carts.controller.js';

const router = Router();

//Criar um carrinho
router.post('/' , CartController.createCart);

//Buscar cart por ID
router.get('/:cid',  CartController.getCart);

//Deleta cart por ID
router.delete('/:cid', CartController.deleteCart);

//Atualiza cart por ID
router.put('/:cid/product/:pid' , CartController.updateProductToCart);

export default router;
