import express from 'express';
import {
    getAllProducts
} from '../Controller/Shop_Controller'

const router = express.Router();

router.get("/get",getAllProducts);

export default router;