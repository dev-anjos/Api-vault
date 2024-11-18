
const express = require('express');
const productManager = require('../controllers/produtcs.controller');
const{validateProductId, validateProductBody}= require('../middleware/products.middleware');
const pm = new productManager
const router = express.Router();

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

// // valido para todas rotas
// router.use(productMiddleware);

router.get('/', async (req, res) => {
    const limit = req.query.limit;

    pm.getProducts().then(products => {
        if (limit) {
            const limitedProducts = products.slice(0, limit);
            res.json(limitedProducts);
        } else {
            res.json(products);
        }
    })

})

router.get('/:id', validateProductId, async (req, res) => {
    const { id } = req.params;
   
    try {
        const product = await pm.getProductById(parseInt(id));
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

router.post('/',validateProductBody , async (req, res) => {
    const { title, description, price, thumbnail = {}, code, stock, category, status} = req.body;
    try {
        const newProduct =  pm.addProduct({ title, description, price, thumbnail, code, stock, category, status});
        res.status(201).json(newProduct);
    } catch (error) {
        res.json({ error: error.message });
    }
})

router.put('/:id',validateProductId ,async (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    try {
        const product = pm.updateProduct(parseInt(id), updatedProduct);
        res.json(product);
    } catch (error) {
        res.json({ error: error.message });
    }
})

router.delete('/:id', validateProductId , async (req, res) => {
    const { id } = req.params;
    
    try {
        const product =  pm.deleteProduct(parseInt(id));
        res.status(200).json("Produto deletado com sucesso");
    } catch (error) {
        res.json({ error: error.message });
    }
    
})
module.exports = router;