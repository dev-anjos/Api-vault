
const express = require('express');
const cartManager = require('../controllers/carts.controller.js');
const validateDataMiddleware = require('../middleware/carts.middleware');
const newCartManager = new cartManager
const router = express.Router();

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.use(validateDataMiddleware);

router.post('/', async (req, res) => {
    const {pid, quantity} = req.body;
    try {
        const newCart = await newCartManager.createCart(pid,quantity);
        res.status(201).json(newCart);
    } catch (error) {
        res.json('error ao criar carrinho: ' + error.message);
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const {cid, pid} = req.params;
    const {quantity} = req.body;
    try {
        const newCart = await newCartManager.addProductToCart(cid,pid, quantity);
        res.status(201).json(newCart);
    } catch (error) {
        res.json('error ao adicionar produto: ' + error.message);
    }
})

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await newCartManager.getCart(parseInt(cid));
        res.json(cart);
    } catch (error) {
        res.json({ error: error.message });
    }
})
module.exports = router;