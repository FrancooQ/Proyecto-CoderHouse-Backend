import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import {Server} from 'socket.io';
import ProductManager from './dao/managers/ProductManager.js';
import mongoose from "mongoose";

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


//MongoDB  userCoder 123456F 
mongoose.connect('mongodb+srv://userCoder:123456F@cluster0.mzylpmw.mongodb.net/');

const httpServer = app.listen(port, () => {
    console.log('Server ON')
})


//Socket.io
const io = new Server(httpServer);

io.on("connection", async (socket) => {
    //#Real Time Products
    console.log("New connection");
    //obtengo todos los productos
    const products = await PM.getProducts();
    socket.emit("realTimeProducts", products);
  
    //Escucho evento newProduct
    socket.on("newProduct", async (data) => {
      const product = {
        title: data.title,
        description: data.description,
        code: data.code,
        price: data.price,
        status: true,
        stock: 10,
        category: "",
        thumbnails: data.thumbnails,
      };
      //creo el producto
      await PM.addProduct(product);
      //obtengo todos los productos nuevamente
      const products = await PM.getProducts();
      socket.emit("realTimeProducts", products);
    });
  
    //Escucho evento deleteProduct
    socket.on("deleteProduct", async (data) => {
      await PM.deleteProduct(data);
      //obtengo todos los productos nuevamente
      const products = await PM.getProducts();
      socket.emit("realTimeProducts", products);
    });
  });