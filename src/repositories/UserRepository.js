import GenericRepository from './GenericRepository.js';

class UserRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    async getPaginatedUsers(filter, options) {
        const { page = 1, limit = 10, sort } = options;

        const paginationOptions = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { last_connection: sort === 'desc' ? 1 : -1 } : null,
            lean: true
        };

        return this.dao.paginate(filter, paginationOptions);
    }
}

export default UserRepository;
