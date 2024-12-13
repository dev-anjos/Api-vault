const mongoose = require('mongoose');

const userCollectionsCarts = "carts";

const cartsSchema = new mongoose.Schema({
    // id: { type: Number, required: true, unique: true, index: true },
    // pid: { type: String, required: true },
    // quantity: { type: Number, required: true },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
            quantity: { type: Number, required: true },
            _id: false
        }
    ]
});

module.exports = mongoose.model(userCollectionsCarts, cartsSchema);