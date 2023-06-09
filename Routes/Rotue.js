import express from 'express';
import ShopModel from '../Model/Shop_Schema.js';
import AuthModel from '../Model/Auth.js';

const router = express.Router();

router.post('/Add_Shop', async (req, res) => {
  try {
    // Extract data from the request body
    const {
      shopNumber, shopSize, mobileNumber,
      shopOwner, shopRental, registrationDate, floorNo, ShopRent
    } = req.body;

    const existingShop = await ShopModel.findOne({ shopNumber });
    if (existingShop) {
      return res.status(409).json({ error: 'A shop with the same shop number already exists...!...Kindly chnage shop number.' });
    }
    // Create a new shop instance based on the schema
    const newShop = new ShopModel({
      shopNumber, shopSize, mobileNumber,
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
      shopSize, mobileNumber, ShopRent, shopNumber,
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
    existingShop.ShopRent = ShopRent;

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

// Update the rent for a shop by shopNumber
router.put('/shops/:shopNumber/rent', async (req, res) => {
  try {
    const { shopNumber } = req.params;
    const { rent_paid_amount, rent_rmaining_amount, rent_paid_date } = req.body;

    // Find the shop by shopNumber
    const shop = await ShopModel.findOne({ shopNumber });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // Add the rent payment to the rent array
    shop.rent.push({ rent_paid_amount, rent_paid_date, rent_rmaining_amount });

    // Update the remaining rent
    shop.Remaining_Rent -= rent_paid_amount;

    // Save the updated shop
    const updatedShop = await shop.save();

    res.status(200).json({ message: 'Rent updated successfully', shop: updatedShop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the rent' });
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



export default router;