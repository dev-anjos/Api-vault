import GenericRepository from './GenericRepository.js';

class ProductsRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    async getByCode(code) {
        return this.dao.findOne({ code });
    }

    async getByCategory(category) {
        return this.dao.find({ category });
    }

    async paginate(filter, options) {
        return this.dao.paginate(filter, options);
    }

     async getPaginatedProducts(filter, options) {
         const { page = 1, limit = 10, sort } = options;

         const paginationOptions = {
             page: parseInt(page),
             limit: parseInt(limit),
             sort: sort ? { price: sort === 'asc' ? 1 : -1 } : null,
             lean: true
         };

         return this.dao.paginate(filter, paginationOptions);
     }
}

export default ProductsRepository;
