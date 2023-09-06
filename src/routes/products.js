import { Router } from "express";
import ProductManager from "../managers/productManager.js";

const router = Router();
//instancio la constante PM que utiliza la clase para gestionar los prodcutos..
const PM = new ProductManager();

//Muestra Array de productos.
router.get('/', (req,res) => {
    ///Obtiene lista de productos.
    const products = PM.getProducts();
    ///Verifica si se paso un parametro limit.
    let limit = +req.query.limit;
    ///Envia el JSON con los productos. 
    res.send({ Products: limit ? products.slice(0, limit) : products});
})

//Muestra producto por id.
router.get('/:pid', (req,res) => {
    //tomo el parametro pid y lo guardo en la constante id.
    const id = +req.params.pid;
    res.send({ Product: PM.getProductsById(id)});
})

//Agrego nuevo producto.
router.post('/', (req,res) => {
    ///destructuring
    let { title, description, code, price, status, stock, category, thumbnails } =
    req.body;

  //valido que todos los campos sean obligatorios y correctos
  if (!title) {
    return res
      .status(400)
      .send({ status: "error", message: "The 'title' is a mandatory field" });
  }
  if (!description) {
    return res
      .status(400)
      .send({
        status: "error",
        message: "The 'description' is a mandatory field",
      });
  }
  if (!code) {
    return res
      .status(400)
      .send({ status: "error", message: "The 'code' is a mandatory field" });
  }
  if (!price) {
    return res
      .status(400)
      .send({ status: "error", message: "The 'price' is a mandatory field" });
  }
  if (!stock) {
    return res
      .status(400)
      .send({ status: "error", message: "The 'status' is a mandatory field" });
  }
  if (!category) {
    return res
      .status(400)
      .send({
        status: "error",
        message: "The 'category' is a mandatory field",
      });
  }

  //agrego el producto con el metodo addProduct.
  if (PM.addProduct(title,description,code,price,status = true,stock,category,thumbnails)){
    res.send({ status: "success", message: "Product added successfully" });
    }else {
    res
      .status(500)
      .send({ status: "error", message: "Error! Product could not be added!" });
    }
});

//Actualizo producto.
router.put('/:pid', (req,res) => {
    const id = +req.body.pid;
    ///Toma el objeto del producto.
    const product = req.body;

    if(PM.updateProduct(id, product)){
        res.send({ status: "success", message: "Product updated successfully" });
    } else {
        res.status(500).send({status: "error",message: "Error! Product could not be updated!"});
    }
});

//Elimino producto.
router.delete("/:pid", (req,res) => {
    const id = +req.params.pid;

    if (PM.deleteProduct(id)) {
        res.send({ status: "success", message: "Product deleted successfully" });
    } else {
        res.status(500).send({status: "error",message: "Error! Product could not be deleted!"});
    }
})

export default router;