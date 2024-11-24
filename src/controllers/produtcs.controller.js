 
const fs = require('fs');
const { parse } = require('path');



class ProductManager {
  constructor() {
    //this.products = [];
    this.path = "src/data/products.json";
    this.id = 1;
  }

  

    // Método privado para leitura do arquivo
    #readFile() {

      if (fs.existsSync(this.path)) {
        const fileContent = fs.readFileSync(this.path, "utf-8");
        // ...
      } else {
        console.error("Arquivo não encontrado:", this.path);
      }

      try {

    
      const fileContent = fs.readFileSync(this.path, "utf-8");
      console.log(fileContent.charCodeAt(0)); // imprime o código do primeiro caractere
      console.log(fileContent.charCodeAt(fileContent.length - 1)); // imprime o código do último caractere

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
        console.log('Produtos salvos com sucesso!');
        } catch (err) {
        console.error('Erro ao salvar os produtos:', err);
        }
    }

    addProduct({ title, description, price, thumbnail, code, stock ,category, status = true, })  {
  

        const existingProducts = this.#readFile();
        const codeExists = existingProducts
          .some((product) => product.code === code); // some = caso a condicao a direita seja verdadeira retorna true e cai no if
        if (codeExists) {
          throw new Error("O código do produto já existe.")
        }
      try {
   
      //calcula o indice do ultimo id utilizando o legnth -1  e acessa o id, na consta e adicionado +1 ao id calculado
      //                     se true                         faz isso
      const lastProductId = existingProducts.length > 0
          ? existingProducts[existingProducts.length - 1].id
          : 0;
      const newProduct = {
        id: lastProductId + 1,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
      };

      existingProducts.push(newProduct);
      
      this.#writeFile(existingProducts)
      console.log('Produtos salvos com sucesso!');
    }catch (err) {
      throw new Error(err);
    }
  }

  getProductById(id) {
    const existingProducts = this.#readFile();
    console.log(existingProducts)
    console.log(id)
    const productId = parseInt(id);
    const product = existingProducts.find((product) => product.id == productId);

    if (!product) {
      throw new Error("Produto não encontrado.");
    }
    return product;
  }

  async getProducts (){
    const products = await this.#readFile();
    return products   
  }

  updateProduct(id, updatedProduct) {
    const existingProducts = this.#readFile();
    const productIndex = existingProducts.findIndex(
      (product) => product.id === id
    );

    if (productIndex == -1) {
      throw new Error("Produto não encontrado.");
    }

    existingProducts[productIndex] = {...existingProducts[productIndex],...updatedProduct,}; //spread operator para juntar os objetos
    const productsJson = JSON.stringify(existingProducts, null, 2);
    fs.writeFileSync(this.path, productsJson);
  }

  deleteProduct(id) {
   
    const existingProducts = this.#readFile();
    const productIndex = existingProducts.findIndex(
      (product) => product.id === id
    );
    if (productIndex === -1) {
      throw new Error( `O produto com o ID informado não foi encontrado.`);
    }
    existingProducts.splice(productIndex, 1);
    this.#writeFile(existingProducts);
  }
};
module.exports = ProductManager