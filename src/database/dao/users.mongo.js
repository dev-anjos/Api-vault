import UsersModel from '../models/user.model.js';

export default class UsersDAO {
    constructor() {
        this.model = UsersModel;
    }

    async find() {
        return this.model.find();
    }

    async findById(id) {
        return this.model.findById(id);
    }

    async createUser(user) {
        return this.model.create(user);
    }

    async findByIdAndDelete(id) {
        return this.model.findByIdAndDelete(id);
    }

    async findByIdAndUpdate(id, update) {
        return this.model.findByIdAndUpdate(
            {_id: id},
            {$set: update},
            {new: true}
        );
    }

    async paginate(filter, options) {
        return this.model.paginate(filter, options);
    } 

}
