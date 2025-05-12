
import mongoose, {startSession} from "mongoose";
import CartDto from "../dto/cart.dto.js";
import {cartService} from "../services/index.js";
import cartsModel from "../database/models/carts.model.js";
import {_CartRepository} from "../repositories/index.js";


class CartsController{

    static createCart = async (req, res) => {
        try {

            const cartDto = new CartDto(req.body);

            const result =  await cartService.createCart(cartDto);

            res.status(201).json({
                status: 'success',
                message: 'Cart created successfully',
                payload: result
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    };

   // static  addProductToCart = async (cid, pid, quantity) => {
   //      const session = await startSession();
   //      try {
   //          await session.withTransaction(async () => {
   //              const existingCart = await cartService.addProductToCart(
   //                  { _id: cid, "products.product": pid },
   //                  { $inc: { "products.$.quantity": quantity } },
   //                  { new: true, session }
   //              );
   //
   //              if (!existingCart) {
   //                  await cartService.updateProductToCart(
   //                      { _id: cid },
   //                      { $push: { products: { product: pid, quantity: quantity } } },
   //                      { session }
   //                  );
   //              }
   //          });
   //      } catch (error) {
   //          throw new Error(error.message);
   //      } finally {
   //          await session.endSession();
   //      }
   //  }

    static  addProductToCart = async (cid, pid, quantity) =>{
        const session = await startSession();
        try {
            await session.withTransaction(async () => {
                const existingCart = await cartService.addProductToCart(
                    { _id: cid, "products.product": pid },
                    { $inc: { "products.$.quantity": quantity } },
                    { new: true, session }
                );

                if (!existingCart) {
                    await cartService.updateProductToCart(
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


    static  getCart = async(req, res) => {

        try{

            const { cid } = req.params;

            if (!cid) {
                return res.status(400).json({ error: 'Formato CID inválido' });
            }

            const cart = await cartService.getCartById(cid);

            if (!cart) {
                return res.status(404).json({ error: "Carrinho não encontrado" });
            }

            res.status(200).send({
                success: "true",
                data: {
                    cart
                }
            });
        }catch (error){
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    }

    static deleteCart = async(req, res) => {
        try {
            const { cid } = req.params;

            const cart = await cartService.deleteCart(cid)
            res.status(201).send({
                success: "true",
            });
        }catch (error){
            res.status(400).send({
                status: 'error',
                message: error.message
            });
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

    static async updateProductToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            const UpdateCart = new CartDto({
                cid: cid,
                pid: pid,
                quantity: quantity
            });

            const objectId = new mongoose.Types.ObjectId(UpdateCart.cid);
            const existingCarts = await _CartRepository.getById(objectId)

            if (!existingCarts) {
                return res.status(404).json({ error: "Carrinho não encontrado" });
            }

            if (!existingCarts.products.some(p => p.product.toString() === UpdateCart.pid)) {
                return res.status(400).json({ error: "Produto não encontrado no carrinho" });
            }

            const updatedCart = await cartService.updateProductToCart(
                UpdateCart.cid,
                UpdateCart.pid,
                UpdateCart.quantity
            );

            res.status(200).json(updatedCart);

        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar produto: ' + error.message });
        }
    }

}

export default CartsController;
