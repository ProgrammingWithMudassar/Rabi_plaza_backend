import express from 'express';

const router = express.Router();

router.get("/get",(req,res)=> res.json("This is api"));

export default router;