import fs from "fs";

class ProductManager {
    constructor() {
        ///Array donde almaceno los productos.
        this.products = [];
        ///Path donde se guardaran los productos.
        this.path = "Products.json";
        ///Llamo al metodo, para asegurarnos de que el archivo exista.
        this.createFile();
    }

    //Creo el metodo createFile
    createFile(){
        ///Verifico si existe el archivo path.
        if(!fs.existsSync(this.path)){
            ///Si existe llamo al metodo, para guardar.
            this.saveProductsInJson();
        }
    }

    //Creo el metodo addProduct
    addProduct(product){
        //Valido codigos duplicados.
        const noDupCode = this.products.some((prod) => prod.code === product.code);
        if(noDupCode){
            console.error(`Error: el codigo "${product.code}" ya existe, intente con otro.`);
            return false; ///Devuelve false para volver al endpoint.
        }
    
    
    //Generador de IDs
    let id = this.products.length + 1; //Numero de elementos del array + 1;
    
    const newProduct = {
        id: id,
        title: product.title,
        description: product.description,
        code: product.code,
        price: product.price,
        status: true,
        stock: product.stock,
        category: product.category,
        thumbnails: product.thumbnails,
    };
    
    ///Pusheo el array
    this.products.push(newProduct);
    ///Guardo en array el producto en el archivo.
    this.saveProductsInJSON();
    return true;
    }

    //Creo el metodo getProducts
    getProducts(){
        ///Lee los productos del archivo y lo convertimos de json a objeto para esto.
        this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
        ///retorno el array de productos.
        return this.products;
    }

    //Creo el metodo getProductsById
    getProductsById(id){
        ///Traigo los productos en objeto con el metodo getProducts.
        const products = this.getProducts();
        ///Devuelvo
        return (
            ///Busco en el array products que traigo con el get, el id que tengo como parametro.
            products.find((prod) => prod.id === id )|| console.error ("Not Found")
        );
    }

    //Creo el metodo deleteProduct
    deleteProducts(id){
        this.products = this.getProducts(); // Obtiene la lista actual de productos desde el archivo
        const product = this.getProductsById(id); // Obtiene el producto por su ID
        if(!product){
            console.error(`El producto con el id: ${id} no existe.`);
            return false; // Si el producto no existe, muestra un mensaje de error y retorna false
        } else {
            ///Si el producto existe, traigo todos los productos diferentes que ese id.
            this.products = this.products.filter((prod) => prod.id !== product.id);
            ///Guardo los cambios en el archivo.
            this.saveProductsInJSON();
            console.log(`El producto con el id: ${product.id} a sido eliminado con exito`);
            return true; 
        }
    }

    //Creo el metodo updateProduct
    updateProduct(id, product){
        ///Traigo la lista de productos.
        this.products = this.getProducts();
        ///Busco el indice del producto que pase por parametro.
        let index = this.products.findIndex((prod) => prod.id === id);
        
        if(index === -1){
            ///Si no encuentra el id.
            console.error(`El producto con id: ${id} no existe`);
            return false;
        }else{ 
            this.products[index].title = product.title;
            this.products[index].description = product.description;
            this.products[index].price = product.price;
            this.products[index].code = product.code;
            this.products[index].status = product.status;
            this.products[index].stock = product.stock;
            this.products[index].category = product.category;
            this.products[index].thumbnails = product.thumbnails;
            this.saveProductsInJSON();
            console.log("Producto actualizado con exito!");
            return true;
        }
    }

    //Metodo saveProduct
    saveProductsInJSON() {
        //Guarda todo lo realizado.
        fs.writeFileSync(this.path, JSON.stringify(this.products));
    }
}

export default ProductManager;