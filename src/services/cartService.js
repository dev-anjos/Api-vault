class CartService {
    constructor(repository) {
        this.repository = repository;
    }

    async getCarts(filter = {}) {
        return this.repository.getAll(filter);
    }

    async getCartById(id) {
        return this.repository.getById(id);
    }

    async CartExist(condition) {
        return this.repository.exists(condition);
    }

    async createCart(productData) {
        return await this.repository.create({
            products: [{
                product: productData.pid,
                quantity: productData.quantity
            }]
        });
    }

    async addProductToCart(cid, pid, quantity) {
        return this.repository.addProductToCart(cid, pid, quantity);
    }

    async updateProductToCart(cid, pid, quantity){
        return this.repository.updateProductToCart(cid, pid, quantity);
    }

    async deleteCart(cid) {
        return await this.repository.delete(cid)
    }

    async decreaseProductQuantity(cid, pid){
        return await this.repository.decreaseProductQuantity(cid, pid)
    }

    async increaseProductQuantity(cid, pid){
        return await this.repository.increaseProductQuantity(cid, pid)
    }

    async removeProductFromCart(cid, pid){
        return await this.repository.increaseProductQuantity(cid, pid)
    }
}

export default CartService
