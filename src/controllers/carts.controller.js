
import mongoose, {startSession} from "mongoose";
import CartDto from "../dto/cart.dto.js";
import {cartService, productService} from "../services/index.js";
import cartsModel from "../database/models/carts.model.js";
import {_CartRepository, _ProductRepository} from "../repositories/index.js";
import {request} from "express";


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


    static addProductToCart = async (req, res) => {
        const product = new CartDto(req.body);

        try {
            let currentCartId = req.session.cartId

            if (!currentCartId) {
                const newCart = await cartService.createCart(product);
                currentCartId = req.session.cartId = newCart._id;
            }

            await _CartRepository.updateProductToCart(req.session.cartId, product.pid, parseInt(product.quantity));

            res.redirect(`/api/carts/view-cart/${req.session.cartId}`);
        } catch (error) {
            res.json('error ao criar carrinho: ' + error.message);
        }
    }


  /*  static  addProductToCart = async (cid, pid, quantity) =>{
        const session = await startSession();
        try {
            await session.withTransaction(async () => {
                const existingCart = await cartService.addProductToCart(
                    { _id: cid, "products.product": pid },
                    { $inc: { "products.$.quantity": quantity } },
                    { new: true, session }
                );

                console.log("aqui")

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
*/

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
    static  removeProductFromCart = async(req,res) => {
        const request = new CartDto({...req.body, cid: req.params.cid});

        try {
            await _CartRepository.removeProductFromCart(request.cid, request.pid);

            res.redirect(`/api/carts/view-cart/${request.cid}`);
        } catch (error) {
            res.json('error ao deletar item do carrinho: ' + error.message);
        }
    }

    // usado apenas nas rotas de view
    static  decreaseProductQuantity = async(req,res) => {
        const request = new CartDto({...req.body, cid: req.params.cid});

        try {
            await _CartRepository.decreaseProductQuantity(request.cid, request.pid);
            res.redirect(`/api/carts/view-cart/${req.session.cartId}`);

        } catch (error) {
            res.json('error ao diminuir item do carrinho: ' + error.message);
        }
    }

    // usado apenas nas rotas de view
    static  increaseProductQuantity = async(req,res) => {
        const request = new CartDto({...req.body, cid: req.params.cid});

        try {
            await _CartRepository.increaseProductQuantity(request.cid, request.pid);
            res.redirect(`/api/carts/view-cart/${req.session.cartId}`);
        } catch (error) {
            res.json('error ao aumentar item do carrinho: ' + error.message);
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


    static async viewCart(req, res) {
        const { cid } = req.params;

        if (!cid) {
            res.send("Carrinho não encontrado");
        }

        const currentCartId = req.session.cartId = cid
        const cart = await cartService.getCartById(currentCartId);

        const productIds = cart.products.map((product) => product.product.toString());
        const products = await Promise.all(productIds.map((id) => productService.getProductById(id)));

        const cartProducts = cart.products.map((cartProduct) => {
            const product = products.find((p) => p._id.toString() === cartProduct.product.toString());
            return { ...product, quantity: cartProduct.quantity };
        });

        res.render("cart", { cartId: currentCartId, cart: cartProducts });
    }
}

export default CartsController;
