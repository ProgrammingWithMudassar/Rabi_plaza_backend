import express from 'express';
import ShopModel from '../Model/Shop_Schema.js';

const router = express.Router();

router.post('/Add_Shop', async (req, res) => {
    try {
        // Extract data from the request body
        const {
            shopNumber, shopSize, mobileNumber, ownerEmail,
            shopOwner, shopRental, registrationDate, floorNo
        } = req.body;

        const existingShop = await ShopModel.findOne({ shopNumber });

        if (existingShop) {
            return res.status(409).json({ error: 'A shop with the same shop number already exists...!...Kindly chnage shop number.' });
        }


        // Create a new shop instance based on the schema
        const newShop = new ShopModel({
            shopNumber, shopSize, mobileNumber, ownerEmail,
            shopOwner, shopRental, registrationDate, floorNo
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


router.put('/Update_Shop/:shopNumber', async (req, res) => {
    try {
        const shopNumber = req.params.shopNumber;

        // Extract data from the request body
        const {
            shopSize, mobileNumber, ownerEmail,
            shopOwner, shopRental, registrationDate, floorNo
        } = req.body;

        // Find the shop based on the provided shop number
        const existingShop = await ShopModel.findOne({ shopNumber });

        if (!existingShop) {
            return res.status(404).json({ error: 'Shop not found.' });
        }

        // Update the shop data
        existingShop.shopSize = shopSize;
        existingShop.mobileNumber = mobileNumber;
        existingShop.ownerEmail = ownerEmail;
        existingShop.shopOwner = shopOwner;
        existingShop.shopRental = shopRental;
        existingShop.registrationDate = registrationDate;
        existingShop.floorNo = floorNo;

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
        // Retrieve all shop data from the database
        const allShops = await ShopModel.find();

        // Respond with the retrieved shop data
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



export default router;