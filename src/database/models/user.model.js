const mongoose = require('mongoose');
const userCollections = "users";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthday: { type: Date, default: Date.now },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: { type: String , default: ''},
});

module.exports = mongoose.model(userCollections, userSchema);
