import mongoose from "mongoose";

const AuthSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
});

const AuthModel = new mongoose.model("AuthSchema", AuthSchema);

export default AuthModel;
