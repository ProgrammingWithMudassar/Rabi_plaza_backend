import express from "express";
import cors from 'cors';
import morgan from 'morgan'
import mongoose from 'mongoose';
import dotenv from "dotenv"
import router from './Routes/Rotue.js'
import cron from "node-cron";
import axios from "axios";

dotenv.config({ path: "./config.env" })

const port = process.env.PORT || 8000;
const app = express();

//use Middleware
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb", extended: true })); //By default this is 100kb
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api", router)



mongoose
    .connect(process.env.ALTAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");

        // Schedule API call on the first day of every month at 12:00 AM
        cron.schedule("0 0 1 * *", async () => {
            try {
                const response = await axios.post("http://localhost:" + port + "/api/updateMonthlyRent");
                console.log(response.data.message);
            } catch (error) {
                console.log("An error occurred while calling the API:", error.message);
            }
        });

        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB:", error.message);
    });