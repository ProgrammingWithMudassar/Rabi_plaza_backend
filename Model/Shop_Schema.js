import mongoose from "mongoose";

const RentSchema = new mongoose.Schema({
  rent_paid_date: {
    type: Date,
    default: Date.now,
  },
  rent_paid_amount: {
    type: Number,
    required: true,
  },
  rent_rmaining_amount: {
    type: Number,
    required: true,
  },
});
  
const NewShopSchema = new mongoose.Schema({
    shopNumber: {
    type: String,
  },
  shopSize: {
    type: String,
  },
  mobileNumber: {
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
  ShopRent:{
    type: String,
  },
  remaining_rent:{
    type: String,
  },
  rent: [RentSchema],
});

const ShopModel = new mongoose.model("NewShopSchema", NewShopSchema);

export default ShopModel;
