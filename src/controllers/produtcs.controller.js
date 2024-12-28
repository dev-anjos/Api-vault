 
// Importação fs
// const fs = require('fs');
// const { parse } = require('path');

const productsModel = require('../database/models/products.model');


class ProductManager {
  constructor() {
    //this.products = [];
    this.path = "src/data/fileSystem/products.json";
    this.id = 1;
  }

    // Método privado para leitura do arquivo -   NÃO UTILIZADO
    // #readFile() {

    //   if (fs.existsSync(this.path)) {
    //     const fileContent = fs.readFileSync(this.path, "utf-8");
    //     // ...
    //   } else {
    //     console.error("Arquivo não encontrado:", this.path);
    //   }

    //   try {

    
    //     const fileContent = fs.readFileSync(this.path, "utf-8");

    //     return fileContent ? JSON.parse(fileContent) : []; // Retorna array vazio se o arquivo estiver vazio
    //   } catch (err) {
    //     res.status(500).json({ error: 'Erro ao ler o arquivo' });
    //     return [];
    //   }
    // }

    // // Método privado para escrita no arquivo
    // #writeFile(data) {
    //     try {
    //     const jsonData = JSON.stringify(data, null, 2);
    //     fs.writeFileSync(this.path, jsonData);
    //     console.log('Produtos salvos com sucesso!');
    //     } catch (err) {
    //       res.status(500).json({ error: 'Erro ao salvar alterações' });
    //     }
    // }


    async addProduct({ title, description, price, thumbnail, code, stock ,category, status = true })  {
      // const existingProducts = this.#readFile();
      try {

        // some = caso a condicao a direita seja verdadeira retorna true e cai no if
  
          //calcula o indice do ultimo id utilizando o legnth -1  e acessa o id, na consta e adicionado +1 ao id calculado
          //                     se true                         faz isso
          // const lastProductId = existingProducts.length > 0
          //     ? existingProducts[existingProducts.length - 1].id
          //     : 0;
            
          // const existingProducts = await productsModel.find();
           
          const newProduct = await productsModel.create({
            // id: lastProductId + 1,
            title, description,
            price, thumbnail: thumbnail || [],
            code, stock,
            status, category,
          });
  
          // existingProducts.push(newProduct);
          // this.#writeFile(existingProducts)
          console.log('Produtos salvos com sucesso!');
        
      } catch (error) {
        console.log(error);
      }  
    }


  async updateProduct(id, updatedProduct) {
    return productsModel.findByIdAndUpdate(
        {_id: id},
        {$set: updatedProduct},
        {new: true}
    );

  }

  // async updateProduct(title, updatedProduct) {
  //   const existingProducts = await productsModel.find();
  //   const productIndex = existingProducts.find(
  //     (product) => product.title === title
  //   );

  //   existingProducts[productIndex] = {...existingProducts[productIndex],...updatedProduct,}; //spread operator para juntar os objetos
  //   await productsModel.updateOne({title}, existingProducts[productIndex]);
  // }

  // Estudando o uso dessa funcao
  // async getProductByName(title) {
  //   const existingProducts = await productsModel.find();
  //   const productName = title;
  //   const product = existingProducts.find((product) => product.title == productName);
  

  //   if (!product) {
  //     throw new Error("Produto não encontrado.");
  //   }
  //   return product;
  // }

  async getProductById(id) {

    // Forma mais verbose
    // const existingProducts = await productsModel.find();
    // const product = existingProducts.find((product) => product._id== id);

    const product = await productsModel.findById(id);
    if (!product) {
      return { error: "Produto não encontrado." };
    }
    return product;
  }

  // getProductById(id) {
  //   // const existingProducts = this.#readFile();
  //   const productId = parseInt(id);
  //   const product = existingProducts.find((product) => product.id == productId);

  //   if (!product) {
  //     throw new Error("Produto não encontrado.");
  //   }
  //   return product;
  // }

  async getProducts (){
    return productsModel.find().lean();
  }

  async deleteProduct(id) {
    await productsModel.findByIdAndDelete(id);
      // existingProducts.splice(productIndex, 1);
      // // this.#writeFile(existingProducts);
  }

}

module.exports = ProductManager