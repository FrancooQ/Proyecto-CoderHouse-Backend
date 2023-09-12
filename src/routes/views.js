import { Router } from "express";
import ProductManager from "../dao/managers/ProductManager.js";

const router = Router();
const PM = new ProductManager();

router.get('/', async (req, res) => {
    const products = await PM.getProducts();
    res.render("home", {products, style: "index.css"});
})

router.get('/realtimeproducts', async (req, res) => {
    res.render("realTimeProducts", {});
})


export default router;