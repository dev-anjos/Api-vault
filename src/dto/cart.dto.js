class CartDto {
    constructor(data) {
        this.cid = data.cid;
        this.pid = data.pid;
        this.quantity = data.quantity;
    }
}

export default CartDto;
