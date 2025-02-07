 
// Importação fs
// const fs = require('fs');
// const { parse } = require('path');

const productsModel = require('../database/models/products.model');


class ProductManager {
  // constructor() {
  //   //this.products = [];
  //   this.path = "src/data/fileSystem/products.json";
  //   this.id = 1;
  // }

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

    try {

        return await productsModel.create({
          title, description,
          price, thumbnail: thumbnail || [],
          code, stock,
          status, category,
        });

    } catch (error) {
      return Error(error.message);
    }
  }


  async updateProduct(id, updatedProduct) {
    return productsModel.findByIdAndUpdate(
        {_id: id},
        {$set: updatedProduct},
        {new: true}
    );

  }

  async getProductById(id) {

    // Forma mais verbose
    // const existingProducts = await productsModel.find();
    // const product = existingProducts.find((product) => product._id== id);

    return productsModel.findById(id);

  }

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
