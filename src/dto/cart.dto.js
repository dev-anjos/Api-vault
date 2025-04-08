class CartDto {
    constructor(newCart) {
        this.cid = newCart.cid
        this.pid = newCart.pid;
        this.quantity = newCart.quantity;
    }
}

export default CartDto;
