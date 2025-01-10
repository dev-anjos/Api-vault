const mongoose = require('mongoose');

const userCollections = "users";

const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    age: {type: Number, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true}
});

module.exports = mongoose.model(userCollections, userSchema);