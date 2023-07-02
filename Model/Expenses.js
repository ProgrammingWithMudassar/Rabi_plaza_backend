import mongoose from "mongoose";


const ExpenseSchema = new mongoose.Schema({
    
  date: {
    type: String,
    
  },
  items:[
    {
        expenseName:{
            type:String
        },
        amount:{
            type:String
        }
    }
  ]
});

const RentShopModel = new mongoose.model("ExpenseSchema", ExpenseSchema);

export default RentShopModel;
