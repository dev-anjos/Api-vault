
const express = require('express');
const cartManager = require('../controllers/carts.controller.js');
const {validateParams, validateCart}= require('../middleware/carts.middleware');
const cartsModel = require("../database/models/carts.model");
const newCartManager = new cartManager
const router = express.Router();
const mongoose = require('mongoose');
const {isValidObjectId} = require("mongoose");

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.post('/', validateCart ,async (req, res) => {
    const {pid, quantity} = req.body;

    try {
        const newCart = await newCartManager.createCart(pid,parseInt(quantity));
        res.status(201).json(newCart);
    } catch (error) {
        res.json('error ao criar carrinho: ' + error.message);
    }
})

router.post('/:cid/product/:pid',validateParams ,async (req, res) => {
    const {cid, pid} = req.params;
    const {quantity} = req.body;

    const objectId = new mongoose.Types.ObjectId(cid);
    const existingCarts = await cartsModel.findById(objectId)
    if (!existingCarts){
        res.status(404).json({ error: "Carrinho não encontrado" });
    }

    try {
        const newCart = await newCartManager.addProductToCart(cid,pid, quantity);
        res.status(201).json(newCart);
    } catch (error) {
        res.json('error ao adicionar produto: ' + error.message);
    }
})

router.get('/:cid',  async (req, res) => {
    const { cid } = req.params;

    if (!isValidObjectId(cid)) {
        return res.status(400).json({ error: 'Formato CID inválido' });
    }

    try {
        const cart = await newCartManager.getCart(cid);
        res.json(cart);
    } catch (error) {
        res.json({ error: error.message });
    }
})

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    if (!isValidObjectId(cid)) {
        return res.status(400).json({ error: 'Formato CID inválido' });
    }

    try {
        await newCartManager.deleteCart(cid);
        res.status(204).send();
    } catch (error) {
        res.json({ error: error.message });
    }


})


module.exports = router;