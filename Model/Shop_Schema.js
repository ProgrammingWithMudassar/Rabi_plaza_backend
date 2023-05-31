import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    shopNumber: {
    type: String,
  },
  shopSize: {
    type: String,
  },
  mobileNumber: {
    type: String,
  },
  ownerEmail: {
    type: String,
  },
  shopOwner: {
    type: String,
  },
  shopRental: {
    type: String,
  },
  registrationDate: {
    type: String,
  },
  floorNo: {
    type: String,
  },
});

const userModel = new mongoose.model("User", userSchema);

export default userModel;
