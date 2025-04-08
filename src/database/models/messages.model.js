import mongoose from "mongoose";

const userCollectionsMessages = "Messages";

const messageSchema = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true },
});

export default mongoose.model(userCollectionsMessages, messageSchema);
