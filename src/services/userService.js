import UserDto from '../dto/user.dto.js';
import ProductDTO from "../dto/product.dto.js";

class UserService {
    constructor(repository) {
        this.repository = repository;
    }

    async getUsers(filter = {}) {
        return this.repository.getAll(filter);
    }

    async getPaginatedUser(filter, options) {
        return this.repository.getPaginatedUsers(filter, options);
    }

    async createUser(UserData) {
        const user = new UserDto(UserData);
        return this.repository.create(user);
    }

    async deleteUser(id) {
        return this.repository.delete(id);
    }

    async findUserByIdAndUpdate(id,userData) {
        const userDto = new UserDto(userData);
        return this.repository.update(id,userDto);
    }

    async findUserByIdAndDelete(id) {
        return this.repository.delete(id);
    }

    async findUserById(id) {
        return this.repository.getById(id);
    }

}

export default UserService
