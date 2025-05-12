import ProductsRepository from "./ProductsRepository.js";
import CartRepository from "./CartRepository.js";
import UserRepository from "./UserRepository.js";

import ProductsDAO from "../database/dao/products.mongo.js";
import CartsDAO from "../database/dao/carts.mongo.js";
import UsersDAO from "../database/dao/users.mongo.js";

const productsDAO = new ProductsDAO();
const _ProductRepository = new ProductsRepository(productsDAO);

const cartsDAO = new CartsDAO();
const _CartRepository = new CartRepository(cartsDAO);


const usersDAO = new UsersDAO();
const _UserRepository = new UserRepository(usersDAO);

export { _ProductRepository, _CartRepository, _UserRepository};
