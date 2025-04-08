import productsModel from '../database/models/products.model.js';

class ProductManager {


  async addProduct(product)  {

    try {
        return await productsModel.create({
          title: product.title,
          description: product.description,
          price: product.price,
          thumbnail: product?.thumbnail || [],
          code: product.code,
          stock: product.stock,
          category: product.category,
          status: product?.status || true
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

export default ProductManager;
