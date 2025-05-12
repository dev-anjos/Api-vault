import CartsModel from '../models/carts.model.js';
import {startSession} from "mongoose";

export default class CartsDAO {
    constructor() {
        this.model = CartsModel;
    }

    async get() {
        return this.model.find();
    }

    async findById(id) {
        return this.model.findById(id);
    }

    async exists(conditions) {
        const result = this.model.exists(conditions).lean;
        return result !== null;
    }

    async create(cart){
        return this.model.create(cart);
    }


    async findByIdAndDelete(id) {
        return this.model.findByIdAndDelete(id);
    }


    async findOneAndUpdate(cartId, productId, quantity) {

        return this.model.findOneAndUpdate(
            { _id: cartId, "products.product": productId },
            { $set: { "products.$.quantity": quantity } },
            { new: true });
    }


    async addProductToCart(cid, pid, quantity) {
       return this.model.findByIdAndUpdate(cid, pid, quantity);
    }

/*    async updateProductToCart(cid, pid, quantity) {
        try {
            return await this.model.findByIdAndUpdate(
                { _id: cid, "products.product": pid },
                { $set: { "products.$.quantity": quantity } },
                { new: true }
            );

        } catch (error) {
            throw new Error(error.message);
        }
    }*/

    async RemoveProductFromCart (cid, pid) {
        try {
            await this.model.findOneAndUpdate(
                { _id: cid },
                { $pull: { products: { product: pid } } }
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async decreaseProductQuantity(cid, pid) {

        try {
            const result = await this.model.findOneAndUpdate(
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
            const result = await this.model.findOneAndUpdate(
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


    async updateProductToCart(cid, pid, quantity) {
        try {
            return await this.model.findOneAndUpdate(
                { _id: cid, "products.product": pid },
                { $set: { "products.$.quantity": quantity } },
                { new: true }
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }
}


