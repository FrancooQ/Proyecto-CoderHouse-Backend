import { Router } from "express";
import ProductManager from "../dao/managers/ProductManager.js";

const router = Router();
const PM = new ProductManager();

router.get('/', (req, res) => {
    const products = PM.getProducts();
    res.render("home", {products, style: "index.css"});
})

router.get('/realtimeproducts', (req, res) => {
    res.render("realTimeProducts", {});
})


export default router;