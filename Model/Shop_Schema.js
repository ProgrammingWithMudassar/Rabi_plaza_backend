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
    default: 0,
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
  Monthly_rent:{
    type: String,
  },
  ShopRent:{
    type: String,
    default: 0,
  },
  shop_remaining_rent:{
    type: String,
    
  },
  last_updated_shop_remaining_rent: {
    type: Date,
    default:null
  },
  zero_remaining_charges_date:{
    type:Date
  },
  rent: [RentSchema],
});

const ShopModel = new mongoose.model("NewShopSchema", NewShopSchema);

export default ShopModel;
