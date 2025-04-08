import ProductsDTO from '../dto/product.dto.js';
import ProductsDAO from '../database/dao/products.mongo.js';

class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getByCode(code) {
        return this.dao.findOne({ code });
    }

    async getByCategory(category) {
        return this.dao.find({ category });
    }
}

export default ProductsRepository;


