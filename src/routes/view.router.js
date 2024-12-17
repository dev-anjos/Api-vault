const express = require('express');
const productManager = require("../controllers/produtcs.controller");
const validateProductBody = require("../middleware/products.middleware");
const productsModel = require("../database/models/products.model");
const router = express.Router();
const pm = new productManager

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

//rota de view
router.get('/realtimeproducts', async (req, res) => {
    const products = await pm.getProducts();
    res.render("realTimeProducts", { products });
});



//rota de view
router.get('/messages', async (req, res) => {

    res.render("chat", {title: 'Home'});
});

//rota de view
router.get('/products', async (req, res) => {
    const products = await pm.getProducts();
    res.render("realTimeProducts", { products });
});


module.exports = router;
