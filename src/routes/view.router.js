import express, {response} from "express";
import ProductManager from "../controllers/produtcs.controller.js";
import CartManager from "../controllers/carts.controller.js";
import productsModel from "../database/models/products.model.js";
import {validateCart}  from "../middleware/carts.middleware.js";
import ProductDto  from  "../dto/product.dto.js";
import {_CartRepository, _ProductRepository} from "../repositories/index.js";
import CartDto from "../dto/cart.dto.js";
import mongoose from "mongoose";
import {cartService, productService, userService} from "../services/index.js";
import CartService from "../services/cartService.js";
import UserController from "../controllers/users.controller.js";

const router = express.Router();
/*
const pm = new ProductManager
const cm = new CartManager
*/

//rota de view
router.get('/addproduct', async (req, res) => {

    if (req.session.user.role !== 'admin') {
       const messages = req.session.messages = "Acesso negado! Espaço destinados a Admin."
       return res.render('forbidden', {messages})
   }
       res.render("addProduct", );
});

router.post('/create',async (req, res) => {
    const product =  new ProductDto(req.body);

    try {

        if (await _ProductRepository.exists({code: product.code}) ||
            await _ProductRepository.exists({title: product.title})) {

            return res.status(400).json({ error: "O código já existe ou titulo ja utilizado" });
        }

        const newProduct =  await _ProductRepository.create(product);

        const io = req.app.socketServer;
        if (io) { io.emit('addProduct', newProduct)}
        res.redirect("/api/view/realtimeproducts");
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "O código ou título já existe no banco de dados" });
        }
        res.status(500).json({ error: error.message });
    }
})

router.get('/products', async (req, res) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const sort = req.query.sort;
    const filter = req.query.query ? { category: req.query.query.toUpperCase() } : {};
    const cartId = req.session.cartId

    if (!req.session.user) {
        const messages = req.session.messages = "Acesso negado! Verifique seu você possui acesso a essa pagina ou está logado"
        return res.render('forbidden' , { messages: messages});
    }
    try {
        const products = await productService.getPaginatedProducts(filter, { page, limit, sort });
        const response = {
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage ? products.prevPage : false,
            nextPage: products.nextPage ? products.nextPage : false,
            page: products.page,
            hasNexTPage: products.hasNextPage ? products.hasNextPage : false,
            hasPrevPage: products.hasPrevPage ? products.hasPrevPage : false,
            prevLink: products.hasPrevPage ? `/api/view/products?page=${products.prevPage}` : null,
            nextLink: products.hasNextPage ? `/api/view/products?page=${products.nextPage}` : null,
        }

        res.render('products', {
            products: response.payload,
            prevLink: response.prevLink,
            nextLink: response.nextLink,
            prevPage: response.prevPage,
            nextPage: response.nextPage,
            page: response.page,
            totalPages: response.totalPages,
            cartId: cartId
        } );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//rota de view
router.get('/realtimeproducts', async (req, res) => {
    const products = await _ProductRepository.getAll();
    res.render("realTimeProducts", { products });
});

//rota de view
router.get('/messages', async (req, res) => {
    res.render("chat", {title: 'Home'});
});

router.get('/detailsProduct/:id', async (req, res) => {
    const { id } = req.params;
    const product = await _ProductRepository.getById(id);

    if (product) {
        res.render("detailsProduct", { title: product.title, price: product.price, description: product.description, product });
    } else {
        res.status(404).send("Produto não encontrado.");
    }
})

// Rotas carrinho
/*router.get('/cart/:cid', async (req, res) => {
    const { cid } = req.params;

    if (!cid) {
        res.send("Carrinho não encontrado");
    }

    const currentCartId = req.session.cartId = cid
    const cart = await _CartRepository.getById(currentCartId);

    const productIds = cart.products.map((product) => product.product.toString());
    const products = await Promise.all(productIds.map((id) => _ProductRepository.getById(id)));

    const cartProducts = cart.products.map((cartProduct) => {
        const product = products.find((p) => p._id.toString() === cartProduct.product.toString());
        return { ...product, quantity: cartProduct.quantity };
    });

    res.render("cart", { cartId: currentCartId, cart: cartProducts });


})*/



router.post('/removeFromCart/:cid',
    async (req, res) => {
        const request = new CartDto({...req.body, cid: req.params.cid});

        try {
            await _CartRepository.removeProductFromCart(request.cid, request.pid);

            res.redirect(`/api/view/cart/${request.cid}`);
        } catch (error) {
            res.json('error ao deletar item do carrinho: ' + error.message);
        }
    })

router.post("/decreaseQuantity/:cid" ,
    async (req, res) => {
    const request = new CartDto({...req.body, cid: req.params.cid});

    try {
        await _CartRepository.decreaseProductQuantity(request.cid, request.pid);
        res.redirect(`/api/carts/view-cart/${req.session.cartId}`);
    } catch (error) {
        res.json('error ao diminuir item do carrinho: ' + error.message);
    }
} )

router.post("/increaseQuantity/:cid" , async (req, res) => {
    const request = new CartDto({...req.body, cid: req.params.cid});

    try {
        await _CartRepository.increaseProductQuantity(request.cid, request.pid);
        res.redirect(`/api/carts/view-cart/${req.session.cartId}`);
    } catch (error) {
        res.json('error ao aumentar item do carrinho: ' + error.message);
    }
} )

//user
router.get('/', async (req, res) => {
    res.render("index");
})

router.get('/login', async (req, res) => {
    res.render("login");
})

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/user-list', UserController.usersList )

router.get('/delete-user/:id', UserController.deleteUser )

router.get('/user-details/:id', UserController.detailsUser )

router.get('/delete-users-inactive', UserController.deleteUsersInactive )


router.get('/forbidden', (req, res) => {
    console.log("failed Strategy");
    const messages = req.session.messages || [];
    res.render('forbidden', {messages });
});

export default router;
