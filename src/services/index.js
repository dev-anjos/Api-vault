import ProductService from './productService.js';
import CartService from './cartService.js';
import UserService from './userService.js';
import {_ProductRepository, _CartRepository, _UserRepository} from '../repositories/index.js';

const productService = new ProductService(_ProductRepository);

const cartService = new CartService(_CartRepository);

const userService = new UserService(_UserRepository);

export { productService, cartService, userService };
