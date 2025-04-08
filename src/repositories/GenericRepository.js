export default class GenericRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getAll() {
        return this.dao.find();
    }

    async getById(id) {
        return this.dao.findById(id);
    }

    async create(data) {
        return this.dao.create(data);
    }

    async update(id, data) {
        return this.dao.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return this.dao.findByIdAndDelete(id);
    }

    async exists(conditions) {
        return this.dao.exists(conditions);
    }
}