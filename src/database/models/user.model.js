import mongoose from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2";

const userCollections = "users";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthday: { type: Date, default: Date.now },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: { type: String , default: ''},
    last_connection: { type: Date, default: Date.now() },
});

userSchema.plugin(mongoosePaginate)
userSchema.pre('findOneAndUpdate', function(next) {
    this.set({ last_connection: new Date() });
    next();
});

export default mongoose.model(userCollections, userSchema);
