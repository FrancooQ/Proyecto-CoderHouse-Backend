import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import {Server} from 'socket.io';
import ProductManager from './managers/productManager.js';

import cartsRoute from './routes/carts.js';
import productsRoute from './routes/products.js';
import viewsRoute from './routes/views.js'


const app = express();
const port=8080;
const PM = new ProductManager();

///Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

///Express
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

//Routes
app.use('/api/carts', cartsRoute);
app.use('/api/products', productsRoute);
app.use('/', viewsRoute);

const httpServer = app.listen(port, () => {
    console.log('Server ON')
})


//Socket.io
const io = new Server(httpServer);

io.on('connection', socket => {
    console.log("Nuevo cliente conectado.");

//obtengo todos los productos
const products = PM.getProducts();
socket.emit("realTimeProducts", products);

//Escucho evento newProduct
socket.on("newProduct", (data) => {
    const product = {
        title: data.title,
        description: data.description,
        price: data.price,
        code: data.code,
        status: "",
        stock: 10,
        category: "",
        thumbnails: ""
    };

    //creo el producto
    PM.addProduct(product);
    //obtengo todos los productos nuevamente
    const products = PM.getProducts();
    socket.emit("realTimeProducts", products);
    });

    //Escucho evento deleteProduct
    socket.on("deleteProduct", (data) => {
    PM.deleteProducts(parseInt(data));
    //obtengo todos los productos nuevamente
    const products = PM.getProducts();
    socket.emit("realTimeProducts", products);
    }); 
});