import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const CM = new CartManager();

//Crea un nuevo carrito.
router.post('/', (req, res) => {
    if(CM.newCart()){
        res.send({status: "sucecss", message: "Cart creado con exito."});
    }else{
        res.status(500).send({
            status: "error",
            message: "Error! The Cart could not be created",
          }); 
    }
});

//Busco carrito por id.
router.get('/:cid', (req,res) => {
    //Tomo id.
    const cid = +req.params.cid;
    //Muestro carrito segun id.
    res.send({Cart : CM.getCartById(cid)});
})

//Agrega productos al carrito seleccionado.
router.post("/:cid/product/:pid", (req, res) => {
    const cid = +req.params.cid;
    const pid = +req.params.pid;
    ///Busco carrito por id.
    const cart = CM.getCartById(cid)
    if(!cart){
      res.status(400).send({status:"error", message:"The Cart does not exists"})
      return;
    }
    ///Si el carrito existe, entonces agrego producto al carrito.
    if(CM.addProductToCart(cid,pid)){
      res.send({ status: "success", message: `Product ${pid} successfully added to Cart ${cid}` })
    }else{
      res.status(500).send({statu:"error",message:`Error! The product could not be added to the Cart ${cid}`})
    }
    
  });


export default router;