 
const fs = require('fs');

class CartManager{
    constructor(){
        this.path = "src/data/carts.json";
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

    createCart(products) {
        console.log('Products:', products); // <--- Adicione isso 
        const existingCarts = this.#readFile();

        try {

            const lastCartId = existingCarts.length > 0
            ? existingCarts[existingCarts.length - 1].id
            : 0;

            const cart = {
                id: lastCartId + 1,
                products: products
            };
            existingCarts.push(cart);
            this.#writeFile(existingCarts);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    getCart(id) {
        const existingCarts = this.#readFile();
        const cart = existingCarts.find((cart) => cart.id === id);
        if (!cart) {
            throw new Error("Carrinho não encontrado.");
        }
        return cart;
    }

};

module.exports = CartManager