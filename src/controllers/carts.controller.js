
import cartsModel from '../database/models/carts.model.js';
import {startSession} from "mongoose";

class CartManager{

    async createCart(pid, quantity) {
        try {
            return await cartsModel.create({products: [{product: pid, quantity: quantity}]});
        } catch (error) {
            return Error(error.message);
        }
    }

    // async addProductToCart(cid, pid, quantity) {
    //     const session = await startSession();
    //     try {
    //         await session.withTransaction(async () => {
    //             const existingCart = await cartsModel.findOneAndUpdate(
    //                 { _id: cid, "products.product": pid },
    //                 { $inc: { "products.$.quantity": quantity } },
    //                 { new: true, session }
    //             );
    //
    //             if (!existingCart) {
    //                 await cartsModel.updateOne(
    //                     { _id: cid },
    //                     { $push: { products: { product: pid, quantity: quantity } } },
    //                     { session }
    //                 );
    //             }
    //         });
    //     } catch (error) {
    //         throw new Error(error.message);
    //     } finally {
    //         await session.endSession();
    //     }
    // }

    async getCart(cid) {
        return cartsModel.findById(cid).lean();
    }

    async deleteCart(cid) {
        try {
            await cartsModel.findByIdAndDelete(cid);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // usado apenas nas rotas de view
    async removeProductFromCart (cid, pid) {
        try {
            await cartsModel.findOneAndUpdate(
                { _id: cid },
                { $pull: { products: { product: pid } } }
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // usado apenas nas rotas de view
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

    // usado apenas nas rotas de view
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
}

export default CartManager;
