import Carts from '../models/carts.model.js';
import {startSession} from "mongoose";
import cartsModel from "../models/carts.model.js";

class carts {
    constructor() {}

    async get() {
        return Carts.find();
    }

    async findById(id) {
        return Carts.findById(id);
    }

    async exists(conditions) {
        const result = Carts.exists(conditions).lean;
        return result !== null;
    }

    async create(product) {
        return Carts.create(product);
    }

    async update(product, quantity) {
        return Carts.findByIdAndUpdate(product.id, quantity);
    }

    async delete(id) {
        return Carts.findByIdAndDelete(id);
    }

    async addProductToCart(cid, pid, quantity) {
        const session = await startSession();
        try {
            await session.withTransaction(async () => {
                const existingCart = await cartsModel.findOneAndUpdate(
                    { _id: cid, "products.product": pid },
                    { $inc: { "products.$.quantity": quantity } },
                    { new: true, session }
                );

                if (!existingCart) {
                    await cartsModel.updateOne(
                        { _id: cid },
                        { $push: { products: { product: pid, quantity: quantity } } },
                        { session }
                    );
                }
            });
        } catch (error) {
            throw new Error(error.message);
        } finally {
            await session.endSession();
        }
    }

    async updateProductToCart(cid, pid, quantity) {
        try {
            return await cartsModel.findOneAndUpdate(
                { _id: cid, "products.product": pid },
                { $set: { "products.$.quantity": quantity } },
                { new: true }
            );

        } catch (error) {
            throw new Error(error.message);
        }
    }

    async RemoveProductFromCart (cid, pid) {
        try {
            await cartsModel.findOneAndUpdate(
                { _id: cid },
                { $pull: { products: { product: pid } } }
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async decreaseProductQuantity(cid, pid) {

        try {
            const result = await cartsModel.findOneAndUpdate(
                { _id: cid, "products.product": pid },
                { $inc: { "products.$.quantity": -1 } },
                { new: true }
            );

            if (!result) {
                return new Error('Cart or Product not found');
            }

            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async increaseProductQuantity(cid, pid) {

        try {
            const result = await cartsModel.findOneAndUpdate(
                { _id: cid, "products.product": pid },
                { $inc: { "products.$.quantity": +1 } },
                { new: true }
            );

            if (!result) {
                return new Error('Cart or Product not found');
            }

            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default carts;
