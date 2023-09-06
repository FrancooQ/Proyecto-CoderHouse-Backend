import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'

import cartsRoute from './routes/carts.js';
import productsRoute from './routes/products.js';


const app = express();
const port=8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use('/api/carts', cartsRoute);
app.use('/api/products', productsRoute);

const httpServer = app.listen(port, () => {
    console.log('Server ON')
})

