
const express = require('express');
const productManager = require('../controllers/produtcs.controller');
const validateProductBody= require('../middleware/products.middleware');
const mongoose = require('mongoose');
const productsModel = require('../database/models/products.model');
const pm = new productManager
const router = express.Router();

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.get('/', async (req, res) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const sort = req.query.sort;
    const filter = req.query.query ? { category: req.query.query.toUpperCase() } : {}; 

    try {
        const products = await productsModel.paginate(filter, { page, limit, sort });
        const resposta = {
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage ? products.prevPage : false,
            nextPage: products.nextPage ? products.nextPage : false,
            page: products.page,
            hasNexTPage: products.hasNextPage ? products.hasNextPage : false,
            hasPrevPage: products.hasPrevPage ? products.hasPrevPage : false,
            prevLink: products.prevLink,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}` : null,
        }
        res.json(resposta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    const findProduct = await productsModel.findById(id);
    if (!findProduct) {
        return res.status(404).json({ error: "Produto nao encontrado." });
    }
   
    try {
        const product = await pm.getProductById(id);
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

})

router.post('/', validateProductBody,async (req, res) => {
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

        await pm.addProduct(
            { title, description, price, thumbnail, code, stock, category, status}
        );

        res.status(201).json({ message: "Produto criado com sucesso!" });
    } catch (error) {
        res.json({ error: error.message });
    }
})

router.put('/:id' ,async (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;

    try {
        const existingProducts = await productsModel.findByIdAndUpdate(id);

        if (!existingProducts) {
            return res.status(404).json({ error: "O produto com o ID informado não foi encontrado." });
        }

        const codeExists = await productsModel.findOne({code: updatedProduct.code})
        if (codeExists	) {
            return res.status(400).json({ error: "Não pode ter dois produtos com o mesmo codigo!" });
        }
    
        const product = await pm.updateProduct(id, updatedProduct);

        return res.json(product);
    } catch (error) {
        res. status(500).json({ error: error.message });
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const productId = await productsModel.findById(id);

        if (!productId) {
            return res.status(404).json({ error: "O produto com o ID informado não foi encontrado." });
        }
        await pm.deleteProduct(id);
        res.status(204).send();
    } catch (error) {
        res.json({ error: error.message });
    }

})

module.exports = router;