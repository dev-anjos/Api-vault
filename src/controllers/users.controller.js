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

        if (req.session.user.role !== 'admin') {
            const messages = req.session.messages = "Acesso negado! Espaço destinados a Admin."
            res.render('forbidden', {messages})
        }

        try {
            const paginatedUser = await userService.getPaginatedUser(filter, {
                page,
                limit,
                sort
            })

            const usersDto = paginatedUser.docs.map(user => new UserDto(user));

            console.log(usersDto)

           res.render( "userList",{
                status: 'success',
                payload: usersDto,
                totalPages: paginatedUser.totalPages,
                prevPage: paginatedUser.prevPage || null,
                nextPage: paginatedUser.nextPage || null,
                page: paginatedUser.page,
                hasNextPage: paginatedUser.hasNextPage,
                hasPrevPage: paginatedUser.hasPrevPage,
                prevLink: paginatedUser.hasPrevPage
                    ? `/api/view/user-list?page=${paginatedUser.prevPage}&limit=${limit}`
                    : null,
                nextLink: paginatedUser.hasNextPage
                    ? `/api/view/user-list?page=${paginatedUser.nextPage}&limit=${limit}`
                    : null,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    static detailsUser = async (req, res) => {
        const { id } = req.params;
        try {

            console.log(id)

            const user = await userService.findUserById(id)
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: "User not found"
                });
            }
            const userDto = new UserDto(user);

            console.log(userDto)
            res.render("detailsUser", {
                payload: userDto
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    static deleteUser = async (req, res) => {
        const { id } = req.params;
        try {
            console.log(id)

            const user = await userService.findUserByIdAndDelete(id);

            console.log(user)
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: "User not found"
                });
            }
            res.render( "success", {
                status: 'success',
                message: "User deleted successfully"
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

