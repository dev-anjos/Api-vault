import ProductsRepository from "./products.repository.js";
import productsDAO from "../database/dao/products.mongo.js";
import CartsDAO from "../database/dao/carts.mongo.js";
import CartRepository from "./cart.repository.js";

const _productsDAO = new productsDAO();
const _ProductRepository = new ProductsRepository(_productsDAO);

const _cartsDAO = new CartsDAO();
const _CartRepository = new CartRepository(_cartsDAO);

export { _ProductRepository, _CartRepository};
