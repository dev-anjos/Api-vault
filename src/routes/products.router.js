
const express = require('express');
const productManager = require('../controllers/produtcs.controller');
// const productMiddleware = require('../middleware/products.middleware');
const pm = new productManager
const router = express.Router();

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

//valido para todas rotas
// router.use(productMiddleware);

router.get('/', async (req, res) => {
    
    pm.getProducts().then(products => {
        const limit = req.query.limit;

        if (limit) {
            const limitedProducts = products.slice(0, limit);
            res.json(limitedProducts);
            res.status(200)
        } else {
            res.status(200)
            res.json(products);
        }
    })
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
   
    try {
        const product = await pm.getProductById(id);
        const htmlResponse = `
        <html>
            <body>
                <h1 style="color: red">${product.title}</h1>
                <p>${product.description}</p>
                <p>${product.price}</p>
                <p>${product.thumbnail}</p>
                <p>${product.code}</p>
                <p>${product.stock}</p>
            </body
        </html>
        `
        res.send(htmlResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

})

router.post('/', async (req, res) => {
    const { title, description, price, thumbnail = {}, code, stock, category, status} = req.body;
    try {
        const newProduct =  pm.addProduct({ title, description, price, thumbnail, code, stock, category, status});
        res.status(201).json(newProduct);
    } catch (error) {
        res.json({ error: error.message });
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    try {
        const product = await pm.updateProduct(parseInt(id), updatedProduct);
        res.json(product);
    } catch (error) {
        res.json({ error: error.message });
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await pm.deleteProduct(parseInt(id));
        res.status(202).json("Produto deletado com sucesso");
    } catch (error) {
        res.json({ error: error.message });
    }
    
})
module.exports = router;