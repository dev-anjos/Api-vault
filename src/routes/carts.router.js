import {Router} from 'express';
import CartController from '../controllers/carts.controller.js';

const router = Router();

//Criar um carrinho
router.post('/' , CartController.createCart);

//Buscar cart por ID
router.get('/:cid',  CartController.getCart);

// view cart
router.get('/view-cart/:cid',  CartController.viewCart);


//Deleta cart por ID
router.delete('/:cid', CartController.deleteCart);

//Atualiza cart por ID
router.post('/add-product' , CartController.addProductToCart);

router.post('/decreaseQuantity/:cid' , CartController.decreaseProductQuantity);

router.post('/increaseQuantity/:cid', CartController.increaseProductQuantity);

router.post( '/removeFromCart/:cid' , CartController.removeProductFromCart);

export default router;
