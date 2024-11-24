const express = require ("express");
const productManager = require('../controllers/produtcs.controller');

const router = express.Router();
const pm = new productManager

router.get("/", async (req, res) => {
    const products = await pm.getProducts();
    res.render("index", { products });
});


module.exports = router