
import ProductDTO from '../dto/Product.dto.js';

class ProductService {
    constructor(repository) {
        this.repository = repository;
    }

    async getProducts(filter = {}) {
        return this.repository.getAll(filter);
    }

    async getProductById(id) {
        return this.repository.getById(id);
    }

    async ProductExist(condition) {
        return this.repository.exists(condition);
    }

    async createProduct(productData) {
        const product = new ProductDTO(productData);
        return this.repository.create(product);
    }

    async getPaginatedProducts(filter, options) {
        return this.repository.getPaginatedProducts(filter, options);
    }

    async updateProduct(id, productData){
        const product = new ProductDTO(productData);
        return this.repository.update(id, product);
    }

    async deleteProduct(id) {
        return this.repository.delete(id);
    }
}

export default ProductService
