import express from 'express';
import ShopModel from '../models/ShopModel';

const router = express.Router();

router.post('/shops', async (req, res) => {
    try {
        // Extract data from the request body
        const {
            shopNumber, shopSize, mobileNumber, ownerEmail,
            shopOwner, shopRental, registrationDate, floorNo
        } = req.body;

        // Create a new shop instance based on the schema
        const newShop = new ShopModel({
            shopNumber, shopSize, mobileNumber, ownerEmail,
            shopOwner, shopRental, registrationDate, floorNo
        });

        // Save the new shop to the database
        const savedShop = await newShop.save();

        // Respond with the saved shop
        res.status(201).json(savedShop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the shop.' });
    }
});






export default router;