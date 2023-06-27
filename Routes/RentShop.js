import express from 'express';

import AuthModel from '../Model/Auth.js';
import RentShopModel from '../Model/Rent_shop.js';

const router = express.Router();

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
      shopOwner, shopRental, registrationDate, floorNo, ShopRent
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

router.put("/rent/:shop_id", async (req, res) => {
  try {
    const { shop_id } = req.params;
    const { date, paidRent } = req.body;

    const shop = await ShopModel.findById(shop_id);

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

router.post('/Add_Shop_For_'), async (req, res) => {
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
      shopOwner, shopRental, registrationDate, floorNo, ShopRent
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
}

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
export default router;