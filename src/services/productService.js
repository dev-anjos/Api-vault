// services/product.service.js
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

    async createProduct(productData) {
        const product = new ProductDTO(productData);
        product.validate();

        // Verifica se código já existe
        if (await this.repository.getByCode(product.code)) {
            throw new Error('Product code already exists');
        }

        return this.repository.create(product);
    }

    // Outros métodos de serviço...
}

export default ProductService
