import ProductsDTO from '../dto/cart.dto.js';
import ProductsDAO from '../database/dao/carts.mongo.js';

class CartsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getCarts =  async() =>{
        return await this.dao.get();
    }

    getCartById = async (id) => {
        return await this.dao.findById(id);
    }

    // productCodeExists = async(code) => {
    //     return await this.dao.exists({ code });
    // }

    CreateCart= async(productData) => {
        const newProduct = new ProductsDTO(productData);
        return this.dao.create(newProduct);
    };

    addProductToCart = async (cid, pid, quantity) => {
        return await this.dao.addProductToCart(cid, pid, quantity);
    };

    updateProductToCart = async (cid, pid, product) => {
        return await this.dao.updateProductToCart(cid, pid, product);
    };

    deleteCart = async (id) => {
        return await this.dao.delete(id);
    };

    removeProductFromCart = async (id, pid) => {
        return await this.dao.RemoveProductFromCart(id, pid);
    };

    decreaseProductQuantity = async (cid, pid) => {
        return await this.dao.decreaseProductQuantity(cid, pid);
    }

    increaseProductQuantity = async (cid, pid) => {
        return await this.dao.increaseProductQuantity(cid, pid);
    }
}

export default CartsRepository;
