import Products from '../models/products.model.js';

class products {
    constructor() {}

    async get() {
        return Products.find();
    }

    async findById(id) {
        return Products.findById(id);
    }

    async exists(conditions) {
        const result = Products.exists(conditions).lean;
        return result !== null;
    }

    async create(product) {
        return Products.create(product);
    }

    async update(product) {
        return Products.findByIdAndUpdate(product.id);
    }

    async delete(id) {
        return Products.findByIdAndDelete(id);
    }
}

export default products;
