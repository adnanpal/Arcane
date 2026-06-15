import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, reqired: true },

    connections:[
        { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    ],
}, { timestamps: true });

export default mongoose.model("User", userSchema);