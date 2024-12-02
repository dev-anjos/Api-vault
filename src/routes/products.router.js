
const express = require('express');
const productManager = require('../controllers/produtcs.controller');
const validateProductBody= require('../middleware/products.middleware');
const pm = new productManager
const router = express.Router();


router.use(express.json())
router.use(express.urlencoded({ extended: true }))


router.get('/', async (req, res) => {

    const limit = req.query.limit;
    
    try {
        pm.getProducts().then(products => {
            if (limit) {
                const limitedProducts = products.slice(0, limit);
                res.render("home", { products: limitedProducts });
            } else {
                res.render("home", { products });
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get('/addproduct', async (req, res) => {
    res.render("addProduct", );
});


router.get('/realtimeproducts', async (req, res) => {
    const products = await pm.getProducts();
    res.render("realTimeProducts", { products });
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
   
    try {
        const product = await pm.getProductById(parseInt(id));
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

})

router.post('/', validateProductBody,async (req, res) => {
    const { title, description, price, thumbnail = {}, code, stock, category, status} = req.body;

    try {
        const newProduct =  pm.addProduct({ title, description, price, thumbnail, code, stock, category, status});
 
        const io = req.app.socketServer;
        if (io) {
            io.emit('addProduct', newProduct);
        }
        res.redirect("/api/products/realtimeproducts");

    } catch (error) {
        res.json({ error: error.message });
    }
   
  
})

router.put('/:id' ,async (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    try {
        const product = pm.updateProduct(parseInt(id), updatedProduct);
        res.json(product);
    } catch (error) {
        res.json({ error: error.message });
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const product =  pm.deleteProduct(parseInt(id));
        res.status(200).json("Produto deletado com sucesso");
    } catch (error) {
        res.json({ error: error.message });
    }
    
})
module.exports = router;