import { productService } from '../services/index.js';
import ProductDto from "../dto/product.dto.js";
import mongoose from "mongoose";

class ProductsController {
  static getProducts = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const filter = req.query.query ? {category: req.query.query.toUpperCase()} : {};

    try {
      const paginatedProducts = await productService.getPaginatedProducts(filter, {
        page,
        limit,
        sort
      });

      res.render( "home", {
        status: 'success',
        payload: paginatedProducts.docs,
        totalPages: paginatedProducts.totalPages,
        prevPage: paginatedProducts.prevPage || null,
        nextPage: paginatedProducts.nextPage || null,
        page: paginatedProducts.page,
        hasNextPage: paginatedProducts.hasNextPage,
        hasPrevPage: paginatedProducts.hasPrevPage,
        prevLink: paginatedProducts.hasPrevPage
            ? `/api/products?page=${paginatedProducts.prevPage}&limit=${limit}`
            : null,
        nextLink: paginatedProducts.hasNextPage
            ? `/api/products?page=${paginatedProducts.nextPage}&limit=${limit}`
            : null,
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: err.message
      });
    }
  };

  static getProductById = async (req, res) => {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: "Product not found"
        });
      }
      res.status(200).json({
        status: 'success',
        payload: product
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  };

  static createProduct = async (req, res) => {
    try {
      const productDto = new ProductDto(req.body);

      if (await productService.ProductExist({title: productDto.title.toUpperCase()}) ||
          await productService.ProductExist({code: productDto.code})) {
        return res.status(400).json({
          status: 'error',
          message: 'Já existe um produto com esse Codigo ou Titulo',
        })
      }

      const result = await productService.createProduct(productDto);

      res.status(201).json({
        status: 'success',
        message: 'Product created successfully',
        payload: result
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }

  static updateProduct = async (req, res) => {
    try {
        const productDto = new ProductDto(req.body);

      if (await productService.ProductExist({title: productDto.title.toUpperCase()}) ||
          await productService.ProductExist({code: productDto.code})) {

        return res.status(400).json({
          status: 'error',
          message: 'Já existe um produto com esse Codigo ou Titulo',
        })
      }

      if (!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({
          status: 'error',
          message: 'ID inválido'
        });
      }

      const result = await productService.updateProduct(
          req.params.id,
          productDto
      );

      res.status(200).json({
          status: 'success',
          message: 'Product updated successfully',
          payload: result
      });
    } catch (error) {
        const statusCode = error.message.includes('not found') ? 404 : 400;
        res.status(statusCode).json({
            status: 'error',
            message: error.message
        });
    }
  }

  static deleteProduct = async (req, res) => {
    try {

      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: "Product not found"
        });
      }

      if (!mongoose.Types.ObjectId.isValid(product.id)){
        return res.status(400).json({
          status: 'error',
          message: 'ID inválido'
        });
      }

      await productService.deleteProduct(product.id);

      res.status(200).json({
        status: 'success',
        message: 'Product deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  static detailsProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);


      const productDto = new ProductDto(product);

      if (product) {
        res.render("detailsProduct", {
          productDto
        });
      }
    } catch (error) {
      res.status(500).send("Produto não encontrado.");
    }
  }

}

export default ProductsController
