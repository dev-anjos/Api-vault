import { productService } from '../services/index.js';
import { userService } from '../services/index.js';
import ProductDto from "../dto/product.dto.js";
import mongoose from "mongoose";
import UserDto from "../dto/user.dto.js";



class UserController{
    static usersList = async (req, res) => {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort;
        const filter = req.query.query ? {last_connection: req.query.query} : {};

        try {
            const paginatedUser = await userService.getPaginatedUser(filter, {
                page,
                limit,
                sort
            })

            const usersDto = paginatedUser.docs.map(user => new UserDto(user));

           res.render( {
                status: 'success',
                payload: usersDto,
                totalPages: paginatedUser.totalPages,
                prevPage: paginatedUser.prevPage || null,
                nextPage: paginatedUser.nextPage || null,
                page: paginatedUser.page,
                hasNextPage: paginatedUser.hasNextPage,
                hasPrevPage: paginatedUser.hasPrevPage,
                prevLink: paginatedUser.hasPrevPage
                    ? `/api/products?page=${paginatedUser.prevPage}&limit=${limit}`
                    : null,
                nextLink: paginatedUser.hasNextPage
                    ? `/api/products?page=${paginatedUser.nextPage}&limit=${limit}`
                    : null,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

export default UserController

