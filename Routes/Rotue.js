import express from 'express';
import ShopModel from '../Model/Shop_Schema.js';
import AuthModel from '../Model/Auth.js';
import RentShopModel from '../Model/Rent_shop.js';
import Expenses from '../Model/Expenses.js'
import mongoose, { ObjectId } from 'mongoose';




const router = express.Router();



const lastUpdatedFile = 'last_updated.json';


router.put('/updateMaintenanceCharges',async(req,res)=>{
  try {
    const allShops = await ShopModel.find();

    
    let rentUpdated = false;

    
    for (const shop of allShops) {
    
      const currentDate = new Date();
      console.log(currentDate)
      const currentMonth = currentDate.getMonth();
      const lastRemainingRentUpdatedMonth = new Date(shop.last_updated_shop_remaining_rent).getMonth();

      if (currentMonth !== lastRemainingRentUpdatedMonth) {
        
        const monthlyRent = parseInt(shop.Monthly_rent);
        const remainingRent = parseInt(shop.shop_remaining_rent);
        const updatedRemainingRent = remainingRent + monthlyRent;


        shop.shop_remaining_rent = updatedRemainingRent;
        shop.last_updated_shop_remaining_rent = currentDate;
        await shop.save();

        
        rentUpdated = true;
      }
    }

    if (rentUpdated) {
      return res.json({ msg: "Rent Updated" });
    } else {
      return res.json({ msg: "New Month Not Started" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while retrieving the shops.'
    });
  }
})


router.put('/updateRent',async(req,res)=>{
  try {
    const allShops = await RentShopModel.find();

    
    let rentUpdated = false;

    
    for (const shop of allShops) {
    
      const currentDate = new Date();
      console.log(currentDate)
      const currentMonth = currentDate.getMonth();
      const lastRemainingRentUpdatedMonth = new Date(shop.last_updated_shop_remaining_rent).getMonth();

      if (currentMonth !== lastRemainingRentUpdatedMonth) {
        
        const monthlyRent = parseInt(shop.Monthly_rent);
        const remainingRent = parseInt(shop.shop_remaining_rent);
        const updatedRemainingRent = remainingRent + monthlyRent;
if(updatedRemainingRent==0){
  ShopModel.findOneAndUpdate(
    { _id: shop_id },
    { $set: { zero_remaining_charges_date: date } },
    { upsert: true, new: true }
  )
    .then(updatedDocument => {
      console.log('Document updated successfully');
      console.log('Updated document:', updatedDocument);
    })
    .catch(err => {
      console.error('Error updating document:', err);
    });
}

        shop.shop_remaining_rent = updatedRemainingRent;
        shop.last_updated_shop_remaining_rent = currentDate;
        await shop.save();

        
        rentUpdated = true;
      }
    }

    if (rentUpdated) {
      return res.json({ msg: "Rent Updated" });
    } else {
      return res.json({ msg: "New Month Not Started" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while retrieving the shops.'
    });
  }
})



router.post('/Add_Shop', async (req, res) => {
  try {
    // Extract data from the request body
    const {
      shopNumber, shopSize, mobileNumber, Monthly_rent,
      shopOwner, shopRental, registrationDate, floorNo, ShopRent
    } = req.body;

    const existingShop = await ShopModel.findOne({ shopNumber });
    if (existingShop) {
      return res.status(409).json({ error: 'A shop with the same shop number already exists...!...Kindly chnage shop number.' });
    }
    // Create a new shop instance based on the schema
    const newShop = new ShopModel({
      shopNumber, shopSize, mobileNumber, Monthly_rent: ShopRent,
      shopOwner, shopRental, registrationDate, floorNo, ShopRent,shop_remaining_rent:ShopRent
    });
    // Save the new shop to the database
    const savedShop = await newShop.save();
    // Respond with the saved shop
    res.status(201).json({
      message: "Shop save successfully.",
      success: true,
      savedShop
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while creating the shop.'
    });
  }
});

router.put('/Update_Shop/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // Extract data from the request body
    const {
      shopSize, mobileNumber, Monthly_rent, shopNumber,
      shopOwner, shopRental, registrationDate, floorNo
    } = req.body;
    console.log(req.body);
    // Find the shop based on the provided ID
    const existingShop = await ShopModel.findById(id);

    if (!existingShop) {
      return res.status(404).json({ error: 'Shop not found.' });
    }
    // Update the shop data
    existingShop.shopNumber = shopNumber;
    existingShop.shopSize = shopSize;
    existingShop.mobileNumber = mobileNumber;
    existingShop.shopOwner = shopOwner;
    existingShop.shopRental = shopRental;
    existingShop.registrationDate = registrationDate;
    existingShop.floorNo = floorNo;
    existingShop.Monthly_rent = Monthly_rent;

    // Save the updated shop to the database
    const updatedShop = await existingShop.save();
    // Respond with the updated shop
    res.status(200).json({
      message: "Shop updated successfully.",
      success: true,
      updatedShop
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while updating the shop.'
    });
  }
});

router.get('/All_Shops', async (req, res) => {
  try {
    const allShops = await ShopModel.find();
    res.status(200).json({
      success: true,
      shops: allShops
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while retrieving the shops.'
    });
  }
});

router.get('/All_Shops/:shopId', async (req, res) => {
  try {
    const shopId = req.params.shopId;
    // Retrieve the shop data from the database based on the provided shop ID
    const shop = await ShopModel.findById(shopId);

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found.' });
    }

    // Respond with the retrieved shop data
    res.status(200).json({
      success: true,
      shop
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while retrieving the shop.' 
    });
  }
});
  
router.delete('/Delete_Shop/:shopNumber', async (req, res) => {
  try {
    const shopNumber = req.params.shopNumber;
    // Find and delete the shop based on the provided shop number
    const deletedShop = await ShopModel.findOneAndDelete({ shopNumber });
    if (!deletedShop) {
      return res.status(404).json({ error: 'Shop not found.' });
    }
    // Respond with a success message
    res.status(200).json({
      success: true,
      message: 'Shop deleted successfully.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while deleting the shop.'
    });
  }
});

router.put("/charges/:shop_id", async (req, res) => {
  try {
    const { shop_id } = req.params;
    const { date, paidRent } = req.body;

    const shop = await ShopModel.findById(shop_id);

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    const remainingRent = parseFloat(shop.shop_remaining_rent) ;
    console.log("Total Remaining Rent:", remainingRent);

    const parsedPaidRent = parseFloat(paidRent);
    const calculatedRemainingRent = remainingRent - parsedPaidRent;
    console.log("Calculated Remaining Rent:", calculatedRemainingRent);

    if (calculatedRemainingRent < 0) {
      return res.status(400).json({ error: "Payment is insufficient" });
    }
    
    if (calculatedRemainingRent === 0) {
      ShopModel.findOneAndUpdate(
        { _id: shop_id },
        { $set: { zero_remaining_charges_date: date } },
        { upsert: true, new: true }
      )
        .then(updatedDocument => {
          console.log('Document updated successfully');
          console.log('Updated document:', updatedDocument);
        })
        .catch(err => {
          console.error('Error updating document:', err);
        });
    }

    const rentPayment = {
      rent_paid_date: date,
      rent_paid_amount: parsedPaidRent,
      rent_rmaining_amount: calculatedRemainingRent,
    };
   
    if (calculatedRemainingRent >= 0) {
      shop.rent.push(rentPayment);
      shop.shop_remaining_rent = calculatedRemainingRent.toString();
      shop.ShopRent = 0
      await shop.save();
    }

    

    res.json({ message: "Maintenance Charges payment updated successfully", shop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update rent payment" });
  }
});

router.put("/rent/:shop_id", async (req, res) => {
  try {
    const { shop_id } = req.params;
    const { date, paidRent } = req.body;

    const shop = await RentShopModel.findById(shop_id);

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    const remainingRent = parseFloat(shop.shop_remaining_rent) ;
    console.log("Total Remaining Rent:", remainingRent);

    const parsedPaidRent = parseFloat(paidRent);
    const calculatedRemainingRent = remainingRent - parsedPaidRent;
    console.log("Calculated Remaining Rent:", calculatedRemainingRent);

    if (calculatedRemainingRent < 0) {
      return res.status(400).json({ error: "Payment is insufficient" });
    }
    if (calculatedRemainingRent === 0) {
      RentShopModel.findOneAndUpdate(
        { _id: shop_id },
        { $set: { zero_remaining_rent_date: date } },
        { upsert: true, new: true }
      )
        .then(updatedDocument => {
          console.log('Document updated successfully');
          console.log('Updated document:', updatedDocument);
        })
        .catch(err => {
          console.error('Error updating document:', err);
        });
    }

    const rentPayment = {
      rent_paid_date: date,
      rent_paid_amount: parsedPaidRent,
      rent_rmaining_amount: calculatedRemainingRent,
    };
   
    if (calculatedRemainingRent >= 0) {
      shop.rent.push(rentPayment);
      shop.shop_remaining_rent = calculatedRemainingRent.toString();
      shop.ShopRent = 0
      await shop.save();
    }

    

    res.json({ message: "Rent payment updated successfully", shop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update rent payment" });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await AuthModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    res.status(200).json({ success: true }); // Login successful
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await AuthModel.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const newUser = new AuthModel({
      username,
      password,
    });
    await newUser.save();
    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post("/updateMonthlyRent", async (req, res) => {
  try {
    const currentDate = new Date();
    if (currentDate.getDate() === 1) {
      const shops = await ShopModel.find();
      for (const shop of shops) {
        shop.shop_remaining_rent += parseFloat(shop.Monthly_rent);
        await shop.save();
      }
      return res.status(200).json({ message: "Monthly rent updated successfully." });
    } else {
      return res.status(200).json({ message: "Not the first day of the month. Monthly rent not updated." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred while updating monthly rent." });
  }
});

router.post('/Add_Rent_Shop', async (req, res) => {
  try {
    // Extract data from the request body
    const {
      shopNumber, shopSize, mobileNumber, Monthly_rent,
      shopOwner, shopRental, registrationDate, floorNo, ShopRent
    } = req.body;

    const existingShop = await RentShopModel.findOne({ shopNumber });
    if (existingShop) {
      return res.status(409).json({ error: 'A shop with the same shop number already exists...!...Kindly chnage shop number.' });
    }
    // Create a new shop instance based on the schema
    const newShop = new RentShopModel({
      shopNumber, shopSize, mobileNumber, Monthly_rent: ShopRent,
      shopOwner, shopRental, registrationDate, floorNo, ShopRent,shop_remaining_rent:ShopRent
    });
    // Save the new shop to the database
    const savedShop = await newShop.save();
    // Respond with the saved shop
    res.status(201).json({
      message: "Shop save successfully.",
      success: true,
      savedShop
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while creating the shop.'
    });
  }
})

router.get('/All_Rent_Shops', async (req, res) => {
  try {
    const allShops = await RentShopModel.find();
    res.status(200).json({
      success: true,
      shops: allShops
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while retrieving the shops.'
    });
  }
})

router.get('/All_Rent_Shops/:shopId', async (req, res) => {
  try {
    const shopId = req.params.shopId;
    // Retrieve the shop data from the database based on the provided shop ID
    const shop = await RentShopModel.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found.' });
    }
    // Respond with the retrieved shop data
    res.status(200).json({
      success: true,
      shop
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while retrieving the shop.'
    });
  }
});

router.put('/Update_Rent_Shop/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // Extract data from the request body
    const {
      shopSize, mobileNumber, Monthly_rent, shopNumber,
      shopOwner, shopRental, registrationDate, floorNo
    } = req.body;
    console.log(req.body);
    // Find the shop based on the provided ID
    const existingShop = await RentShopModel.findById(id);

    if (!existingShop) {
      return res.status(404).json({ error: 'Shop not found.' });
    }
    // Update the shop data
    existingShop.shopNumber = shopNumber;
    existingShop.shopSize = shopSize;
    existingShop.mobileNumber = mobileNumber;
    existingShop.shopOwner = shopOwner;
    existingShop.shopRental = shopRental;
    existingShop.registrationDate = registrationDate;
    existingShop.floorNo = floorNo;
    existingShop.Monthly_rent = Monthly_rent;

    // Save the updated shop to the database
    const updatedShop = await existingShop.save();
    // Respond with the updated shop
    res.status(200).json({
      message: "Shop updated successfully.",
      success: true,
      updatedShop
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while updating the shop.'
    });
  }
});

router.delete('/Delete_Rent_Shop/:shopNumber', async (req, res) => {
  try {
    const shopNumber = req.params.shopNumber;
    // Find and delete the shop based on the provided shop number
    const deletedShop = await RentShopModel.findOneAndDelete({ shopNumber });
    if (!deletedShop) {
      return res.status(404).json({ error: 'Shop not found.' });
    }
    // Respond with a success message
    res.status(200).json({
      success: true,
      message: 'Shop deleted successfully.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while deleting the shop.'
    });
  }
});

router.put("/Rent_Shop/:shop_id", async (req, res) => {
  try {
    const { shop_id } = req.params;
    const { date, paidRent } = req.body;
    const shop = await RentShopModel.findById(shop_id);
    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }
    const remainingRent = parseFloat(shop.shop_remaining_rent) + parseFloat(shop.ShopRent);
    console.log("Total Remaining Rent:", remainingRent);
    const parsedPaidRent = parseFloat(paidRent);
    const calculatedRemainingRent = remainingRent - parsedPaidRent;
    console.log("Calculated Remaining Rent:", calculatedRemainingRent);
    if (calculatedRemainingRent < 0) {
      return res.status(400).json({ error: "Payment is insufficient" });
    }
    const rentPayment = {
      rent_paid_date: date,
      rent_paid_amount: parsedPaidRent,
      rent_remaining_amount: calculatedRemainingRent,
    };
    if (calculatedRemainingRent >= 0) {
      shop.rent.push(rentPayment);
      shop.shop_remaining_rent = calculatedRemainingRent.toString();
      shop.ShopRent = 0
      await shop.save();
    }
    res.json({ message: "Rent payment updated successfully", shop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update rent payment" });
  }
});

router.post('/addexpense',async(req,res)=>{
  const { date, expenseName, amount,description } = req.body;
  const foundExpense = await Expenses.findOne({ date });
  
  if (foundExpense) {
    // If the expense exists, update the items array by adding multiple expenses
    await Expenses.updateOne(
      { date },
      { $push: { items: { $each: [{ expenseName, amount ,description}] } } }
    )
      .then(() => {
        console.log('Items added successfully');
        res.json({ msg: 'Expenses Added' });
      })
      .catch(err => {
        console.error('Error updating document:', err);
        res.status(500).json({ error: 'Internal server error' });
      });
  } else {
    const expense = new Expenses({ date, items: [{ expenseName, amount,description }] });
  
    expense.save()
      .then(() => {
        console.log('Document created successfully');
        res.json({ msg: 'Expense Added' });
      })
      .catch(err => {
        console.error('Error creating document:', err);
        res.status(500).json({ error: 'Internal server error' });
      });
  }
  
})
router.delete("/deleteexpense/:id/items/:itemId", async (req, res) => {
  try {
    const { id, itemId } = req.params;

    
    const expense = await Expenses.findById(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    
    const itemIndex = expense.items.findIndex((item) => item._id.toString() === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found" });
    }

    
    expense.items.splice(itemIndex, 1);

    
    await expense.save();

    return res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/getexpenses/:date',async(req,res)=>{
  try {
    const {date}=req.params
    const expenses = await Expenses.find({date});

    return res.json(expenses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }

})
export default router;