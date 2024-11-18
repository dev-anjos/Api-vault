const fs = require('fs');

class CartManager{
    constructor(){
        this.path = "data/carts.json";
        this.id = 1;
    }

    // Método privado para leitura do arquivo
    #readFile() {
        try {
            const fileContent = fs.readFileSync(this.path, "utf-8");
            return fileContent ? JSON.parse(fileContent) : []; // Retorna array vazio se o arquivo estiver vazio
        } catch (err) {
            console.error("Erro ao ler o arquivo:", err);
        return [];
        }
    }

    // Método privado para escrita no arquivo
    #writeFile(data) {
        try {
            const jsonData = JSON.stringify(data, null, 2);
            fs.writeFileSync(this.path, jsonData);
            console.log('Carrinho criado com sucesso');
        } catch (err) {
            console.error('Erro ao salvar carrinho:', err);
        }
    }

    createCart(pid,quantity) {
        const existingCarts = this.#readFile();

        if (!pid || !quantity) {
            throw new Error("Todos os campos são obrigatórios.");
        }

        try {
            const lastCartId = existingCarts.length > 0
            ? existingCarts[existingCarts.length - 1].id
            : 0;

            const cart = {
                id: lastCartId + 1,
                products: [
                    {
                        product: pid,
                        quantity: quantity
                    }
                ]

            };
            existingCarts.push(cart);
            this.#writeFile(existingCarts);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    addProductToCart(cid, pid, quantity) {
        const existingCarts = this.#readFile();
        const cartIndex = existingCarts.findIndex((cart) => cart.id === parseInt(cid));
        const productIndex = existingCarts[cartIndex].products.findIndex((x) => x.product === parseInt(pid));

        if (cartIndex === -1) 
        {
            throw new Error("Carrinho não encontrado.");
        }

        if (productIndex !== -1) 
        {
            existingCarts[cartIndex].products[productIndex].quantity += quantity;
            this.#writeFile(existingCarts);
            return;
        }

        existingCarts[cartIndex].products.push({ product: parseInt(pid), quantity: quantity });
        this.#writeFile(existingCarts);
    }

    getCart(id) {
        const existingCarts = this.#readFile();


        if (!id) 
        {
            throw new Error("ID do carrinho não fornecido.");
        }
        const cart = existingCarts.find((cart) => cart.id === parseInt(id));
        if (!cart) 
        {
            throw new Error("Carrinho não encontrado.");
        }
        return cart;
    }

};


module.exports = CartManager