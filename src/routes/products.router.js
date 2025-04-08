import express from "express";
import productManager from '../controllers/produtcs.controller.js';
import validateProductBody from '../middleware/products.middleware.js';
import productsModel from '../database/models/products.model.js';
import ProductDto from "../dto/product.dto.js";
import {_ProductRepository} from "../repositories/index.js";

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
        const resp = {
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
        res.status(200).send({
            status: resp.status,
            products: resp.payload,});
    } catch (err) {
        res.status(500).send({ status: 'error', message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await _ProductRepository.getProductById(id);
        if (!product) {
            return res.status(404).json({ error: "O produto com o ID informado não foi encontrado." });
        }

        res.status(200).send({
            success: "true",
            message: "Produto encontrado!",
            payload : product
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post('/', validateProductBody,async (req, res) => {
    const product = new ProductDto(req.body);

    try {

        if (await _ProductRepository.productCodeExists(product.code)) {
            return res.status(400).send({ error: "O código já existe" });
        }

        if (await productsModel.findOne({title: product.title.toUpperCase()})) {
            return res.status(400).json({ error: "O nome do produto já existe" });
        }

        res.status(201).send({
            success: "true",
            message: "Produto criado com sucesso!",
            payload : {product}
        });
    } catch (error) {
        res.json({
            success: "false",
            message: error.message
        });
    }
})

router.put('/:id' ,async (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;

    try {

        if (! await _ProductRepository.getProductById(id)) {
            return res.status(404).json({ error: "O produto com o ID informado não foi encontrado." });
        }

        if (await _ProductRepository.productCodeExists(updatedProduct.code)) {
            return res.status(400).json({ error: "Não pode ter dois produtos com o mesmo codigo!" });
        }

        await _ProductRepository.updateProduct(id, updatedProduct);

        return res.status(200).send({
            success: "true",
            message: "Produto atualizado com sucesso!",
        });
    } catch (error) {
        res.status(500).send({
            success: "false",
            message: error.message });
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const productId = await _ProductRepository.getProductById(id);

        if (!productId) {
            return res.status(404).send({
                success: "false",
                error: "O produto com o ID informado não foi encontrado."
            });
        }

        await _ProductRepository.deleteProduct(id);
        res.status(204).send({
            message: "Produto deletado com sucesso!",
            success: "true",
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: "false"
        });
    }
})
export default router;
