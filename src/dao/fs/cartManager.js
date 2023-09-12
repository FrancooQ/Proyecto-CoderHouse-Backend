import fs from "fs";

class CartManager {
  //defino el constructor
  constructor() {
    this.carts = [];
    this.path = "Carts.json";
    this.createFile();
  }
  //inicializo el Carts.json con un metodo createFile()
  createFile() {
    if (!fs.existsSync(this.path)) {
      this.saveCartsInJSON();
    }
  }

  //Método newCart
  newCart() {
    //Tomo el carrito.
    this.carts = this.getCarts();
    //genero id, segun longitud de array+1
    let id = this.carts.length + 1;
    //creo un objeto con el id, y con una propiedad con un array vacio, este mismo lo pusheo al array carts.
    this.carts.push({ id, products: [] });
    //guardo el array de objetos en el archivo.
    this.saveCartsInJSON();
    return true; //respuesta al endpoint
  }

  //Método getCarts
  getCarts() {
    //obtengo la lista de carritos.
    this.carts = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    return this.carts;
  }

  //Método getCartById
  getCartById(id) {
    const carts = this.getCarts();
    return carts.find((cart) => cart.id === id) || console.error("Not found");
  }

  addProductToCart(cid, pid) {
    ///Obtengo lista de carritos.
    this.carts = this.getCarts();
    ///busca el carrito con la id que le pasamos en cid.
    const cart = this.carts.find((cart) => cart.id === cid);
    if (!cart) {
      return false;
    }

    ///busca el producto con el id que le pasamos en pid.
    let product = cart.products.find((prod) => prod.product === pid);

    //si el producto ya existe en el carrito seleccionado
    if (product) {
      product.quantity += 1;
    } else {
        //si no existe, agrega un objeto al array con el id: pid y cantidad 1.
        cart.products.push({ product: pid, quantity: 1 });
    }
    this.saveCartsInJSON();
    console.log("Cart updated!");
    return true; //respuesta para el endpoint
  }

  saveCartsInJSON() {
    fs.writeFileSync(this.path, JSON.stringify(this.carts));
  }
}

export default CartManager;