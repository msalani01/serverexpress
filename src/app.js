const express = require('express');
const fs = require('fs').promises; 
const path = require('path'); 
const ProductManager = require('./ProductManager'); 
const { send } = require('process');
const session = require('express-session');
const app = express();
const port = 8080;

const productManager = new ProductManager('C:/Users/M/Documents/Dev/Servidor_Express/src/products.json');
var __dirname = "C:/Users/M/Documents/Dev/Servidor_Express"

const productsFilePath = path.join(__dirname, 'src', 'products.json');

app.use(session({
  secret: 'tu_secreto', 
  resave: false,
  saveUninitialized: true
}));

async function cargarProductos() {
  try {
    console.log(productsFilePath);  
    const productsData = await fs.readFile(productsFilePath, 'utf8');
    const products = JSON.parse(productsData);
    products.forEach((product) => {
      productManager.addProduct(product);
    });
  } catch (error) {
    console.error('Error al cargar productos desde el archivo:', error.message);
  }
}



app.get('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});


app.get('/products', (req, res) => {
  const { limit } = req.query;
  let allProducts = productManager.getAllProducts();

  if (limit) {
    const limitNumber = parseInt(limit);
    allProducts = allProducts.slice(0, limitNumber);
  }

  res.json(allProducts);
});

app.post('/products', (req, res) => {
  const newProduct = req.body;
  productManager.addProduct(newProduct);
  res.send('producto agregado');

  const { title, description, code, price, stock, category, thumbnails } = req.body;

  
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
  }


  const newProductcart = {
    id: productManager.getNextId(),
    title,
    description,
    code,
    price,
    status: true, // Por defecto
    stock,
    category,
    thumbnails: thumbnails || [], 
  };


  productManager.addProduct(newProductcart);


  res.status(201).json(newProductcart);

});

app.listen(port, () => {
  console.log(`app escuchando en ${port}`);
});

app.get('/cart', (req, res) => {
  const productsInCart = obtenerProductosEnElCarrito(req);
  res.json({ cart: productsInCart });
});


function obtenerProductosEnElCarrito(req) {
 
  const session = req.session;


  if (session.cart) {
 
    return session.cart;
  } else {
   
    return [];
  }
}


cargarProductos()