import express from "express";
import cors from 'cors';
import morgan from 'morgan'
// import routes from './Routes/Route.js'
import dotenv from "dotenv"
// import conn from './db/connection.js'


//environment file
// dotenv.config({ path: "./config.env" })

//variables
const port = process.env.PORT || 8000;
const app = express();

//use Middleware
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


//use Routes
// app.use("/expense", routes)


//db connection
// conn.then(db => {
//     if (!db) return process.exit(1);



//     app.on("error", err => console.log(`Failed to Connection with HTTP server:${err}`))
// })

app.listen(
    port,
    () => {
        console.log(`Server is running on ${port} port`);
    })