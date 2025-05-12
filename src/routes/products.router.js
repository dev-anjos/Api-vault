import {Router} from "express";
import validateProductBody from '../middleware/products.middleware.js';
import ProductsController from "../controllers/produtcs.controller.js";

const router = Router();

router.get('/', ProductsController.getProducts);
router.get('/:id', ProductsController.getProductById);
router.post('/', validateProductBody, ProductsController.createProduct);
router.put('/:id', validateProductBody, ProductsController.updateProduct);
router.delete('/:id', ProductsController.deleteProduct);

//view

router.get('/detailsProduct/:id', ProductsController.detailsProduct)

export default router;
