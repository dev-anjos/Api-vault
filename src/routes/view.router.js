const express = require('express');
const productManager = require("../controllers/produtcs.controller");
const cartManager = require("../controllers/carts.controller");
const cartsModel = require("../database/models/carts.model");
const validateProductBody = require("../middleware/products.middleware");
const productsModel = require("../database/models/products.model");
const {validateCart} = require("../middleware/carts.middleware");
const router = express.Router();
const pm = new productManager
const cm = new cartManager

//rota de view
router.get('/addproduct', async (req, res) => {
    res.render("addProduct", );
});

router.post('/create',async (req, res) => {
    const {
        title, description, price, thumbnail = {},code, stock, category, status
    } = req.body;

    try {

        //Forma mais verbose
        // const existingProducts = await productsModel.find();
        // const codeExists =
        //   existingProducts.some((product) => product.code === code)
        // ;

        const codeExists = await productsModel.findOne({code: code})
        if (codeExists) {
            return res.status(400).json({ error: "O código já existe" });
        }

        const newProduct =  pm.addProduct(
            { title, description, price, thumbnail, code, stock, category, status}
        );

        const io = req.app.socketServer;
        if (io) { io.emit('addProduct', newProduct)}
        res.redirect("/api/view/realtimeproducts");
    } catch (error) {
        res.json({ error: error.message });
    }
})

router.get('/products', async (req, res) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const sort = req.query.sort;
    const filter = req.query.query ? { category: req.query.query.toUpperCase() } : {};

    try {
        const products = await productsModel.paginate(filter, { page, limit, sort });
        const response = {
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage ? products.prevPage : false,
            nextPage: products.nextPage ? products.nextPage : false,
            page: products.page,
            hasNexTPage: products.hasNextPage ? products.hasNextPage : false,
            hasPrevPage: products.hasPrevPage ? products.hasPrevPage : false,
            prevLink: products.hasPrevPage ? `/api/view/products?page=${products.prevPage}` : null, //.d
            nextLink: products.hasNextPage ? `/api/view/products?page=${products.nextPage}` : null,
        }

        res.render('products', {
            products: response.payload,
            prevLink: response.prevLink,
            nextLink: response.nextLink,
            prevPage: response.prevPage,
            nextPage: response.nextPage,
            page: response.page,
            totalPages: response.totalPages
        } );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//rota de view
router.get('/realtimeproducts', async (req, res) => {
    const products = await pm.getProducts();
    res.render("realTimeProducts", { products });
});

//rota de view
router.get('/messages', async (req, res) => {
    res.render("chat", {title: 'Home'});
});

router.get('/detailsProduct/:id', async (req, res) => {
    const { id } = req.params;
    const product = await pm.getProductById(id);

    if (product) {
        res.render("detailsProduct", { title: product.title, price: product.price, description: product.description, product });
    } else {
        res.status(404).send("Produto não encontrado.");
    }
})

// Rotas carrinho
router.get('/cart/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await cm.getCart(cid);
    const productIds = cart.products.map((product) => product.product.toString());
    const products = await Promise.all(productIds.map((id) => pm.getProductById(id)));

    const cartProducts = cart.products.map((cartProduct) => {
        const product = products.find((p) => p._id.toString() === cartProduct.product.toString());
        return { ...product, quantity: cartProduct.quantity };
    });

    res.render("cart", { cartId: cid, cart: cartProducts });
})

router.post('/addtocart', validateCart ,async (req, res) => {
    const {pid, quantity} = req.body;

    try {
        const newCart = await cm.createCart(pid,parseInt(quantity));
        const io = req.app.socketServer;
        if (io) { io.emit('updateCart' , newCart)}
        res.redirect("cart/" + newCart._id);
    } catch (error) {
        res.json('error ao criar carrinho: ' + error.message);
    }
})

module.exports = router;
