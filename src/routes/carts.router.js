
const express = require('express');

const cartManager = require('../controllers/carts.controller.js');
const newCartManager = new cartManager
const router = express.Router();

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.post('/', async (req, res) => {
    const product = req.body;
    console.log(product)
    try {
        const newCart = await newCartManager.createCart(product);
        res.status(201).json(newCart);
    } catch (error) {
        res.json({ error: error.message });
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