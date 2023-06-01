import express from 'express';

const router = express.Router();

router.get("/get",async (req,res)=>{
    res.send({ message: "Somthing went wrong." });
});

export default router;