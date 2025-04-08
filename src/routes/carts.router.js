
import express from 'express';
import CartManager from '../controllers/carts.controller.js';
import {validateParams, validateCart}  from '../middleware/carts.middleware.js'
import cartsModel from "../database/models/carts.model.js";
import mongoose from 'mongoose';
import {isValidObjectId} from "mongoose";
import ProductDto from "../dto/product.dto.js";
import CartDto from "../dto/cart.dto.js";
import cartsMongo from "../database/dao/carts.mongo.js";
import {_CartRepository} from "../repositories/index.js";

const newCartManager = new CartManager;
const router = express.Router();

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.post('/', validateCart ,async (req, res) => {
    const {pid, quantity} = req.body;
    const newCart = new CartDto(...req.body);

    try {
        const newCart = await _CartRepository.CreateCart(newCart.pid, parseInt(newCart.quantity));
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json('error ao criar carrinho: ' + error.message);
    }
});

router.patch('/:cid/product/:pid',validateParams ,async (req, res) => {
    const UpdateCart = new CartDto({...req.body, cid: req.params.cid});

    const existingCarts = await cartsModel.findById(UpdateCart.cid)
    if (!existingCarts){
        return res.status(404).json({ error: "Carrinho não encontrado" });
    }

    try {
        const result = await _CartRepository.addProductToCart(UpdateCart.cid, UpdateCart.pid, { product: UpdateCart.pid, quantity: UpdateCart.quantity })
        res.status(201).json(result);
    } catch (error) {
        res.status(500).send({
            success: "false",
            message: error.message
        });
    }
})

router.get('/:cid',  async (req, res) => {
    const { cid } = req.params;

    if (!isValidObjectId(cid)) {
        return res.status(400).json({ error: 'Formato CID inválido' });
    }

    try {
        const cart = await _CartRepository.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrinho não encontrado" });
        }
        res.status(200).send({
            success: "true",
            data: {
                cart
            }
        });
    } catch (error) {
        res.status(500).send({
            success: "false",
            message: error.message
        });
    }
})

router.put('/:cid/product/:pid' ,async (req, res) => {
    const UpdateCart = new CartDto({...req.body, cid: req.params.cid});

    const objectId = new mongoose.Types.ObjectId(UpdateCart.cid);
    const existingCarts = await _CartRepository.getCartById(objectId)
    if (!existingCarts){
        return res.status(404).json({ error: "Carrinho não encontrado" });
    }

    if (!existingCarts.products.find((product) => product.product.toString() === UpdateCart.pid)) {
        return res.status(400).json({ error: "Produto nao encontrado" });
    }

    try {
        const newCart = await _CartRepository.updateProductToCart(UpdateCart.cid, UpdateCart.pid, UpdateCart.quantity);
        res.status(201).json(newCart);
    } catch (error) {
        res.json('error ao adicionar produto: ' + error.message);
    }
})


router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    const findCart = await _CartRepository.getCartById(cid)
    if (!findCart){
        return res.status(404).json({ error: "Carrinho não encontrado" });
    }

    if (!isValidObjectId(cid)) {
        return res.status(400).json({ error: 'Formato CID inválido' });
    }

    try {
        await _CartRepository.deleteCart(cid);
        res.status(204).send();
    } catch (error) {
        res.json({ error: error.message });
    }

})

export default router;
