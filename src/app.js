const express = require('express');
const fs = require('fs').promises; 
const path = require('path'); 
const ProductManager = require('./ProductManager'); 
const { send } = require('process');

const app = express();
const port = 8080;

const productManager = new ProductManager('C:/Users/M/Documents/Dev/Servidor_Express/src/products.json');
var __dirname = "C:/Users/M/Documents/Dev/Servidor_Express"

const productsFilePath = path.join(__dirname, 'src', 'products.json');

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
});

app.listen(port, () => {
  console.log(`app escuchando en ${port}`);
});

cargarProductos()