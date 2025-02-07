const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userCollectionsProduct = "products";

const productSchema = new mongoose.Schema({
    // id: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true, unique: true },
    description:  { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: {type: Array},
    code: {
        type: String,
        unique: true,
        required: true   
    },
    stock:  { type: Number, required: true },
    category: { type: String, required: true },
    status: Boolean
});

productSchema.pre('save', function(next) {
    this.title = this.title.toUpperCase();
    this.description = this.description.toUpperCase();
    this.code = this.code.toUpperCase();
    this.category = this.category.toUpperCase();
    next();
  });

productSchema.plugin(mongoosePaginate)
module.exports = mongoose.model(userCollectionsProduct, productSchema);
