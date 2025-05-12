import ProductsModel from '../models/products.model.js';

export default class ProductsDAO {
    constructor() {
        this.model = ProductsModel;
    }

    async find() {
        return this.model.find();
    }

    async findById(id) {
        return this.model.findById(id);
    }

    async exists(conditions) {
        return this.model.findOne(conditions);
    }

    async create(product) {
        return this.model.create(product);
    }

/*    async findByIdAndUpdate(id, update, options = {}) {
        return this.model.findByIdAndUpdate(id, update, { ...options, new: true });
    }*/

    async findByIdAndUpdate(id, update) {
        return this.model.findByIdAndUpdate(
            {_id: id},
            {$set: update},
            {new: true}
        );
    }

    async findByIdAndDelete(id) {
        return this.model.findByIdAndDelete(id);
    }

    async findOne(conditions) {
        return this.model.findOne(conditions);
    }

    async paginate(filter, options) {
        return this.model.paginate(filter, options);
    }
}
