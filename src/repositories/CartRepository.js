import GenericRepository from './GenericRepository.js';

class CartsRepository extends GenericRepository {
    constructor(dao) {
       super(dao);
    }

    async addProduct(cartId, productId, quantity = 1) {
        return this.dao.findByIdAndUpdate(
            cartId,
            { $push: { products: { product: productId, quantity } } },
            { new: true }
     )
    }

    async addProductToCart(cid, pid, quantity) {
        return this.dao.findByIdAndDelete(cid, pid, quantity);
    }
/*
    async updateProductQuantity(cid, pid, quantity) {
        return this.dao.update(cid, pid, quantity);
    }*/

    updateProductToCart = async (cid, pid, quantity) => {
        return await this.dao.updateProductToCart(cid, pid, quantity);
    };

/*
    async addProductToCart(cid, pid, quantity){
        return await this.dao.findByIdAndUpdate(cid, pid, quantity);
    };
*/

    removeProductFromCart = async (id, pid) => {
        return await this.dao.RemoveProductFromCart(id, pid);
    };

    decreaseProductQuantity = async (cid, pid) => {
        return await this.dao.decreaseProductQuantity(cid, pid);
    }

    increaseProductQuantity = async (cid, pid) => {
        return await this.dao.increaseProductQuantity(cid, pid);
    }

    updateOne = async (filter, update, options = {}) => {
        return this.dao.updateOne(filter, update, options);
    }
}

export default CartsRepository;
