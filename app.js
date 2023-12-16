const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs'); // Agregamos el módulo 'fs' para manejar archivos
const path = require('path'); // Agregamos el módulo 'path' para manejar rutas
const ProductManager = require('./ProductManager'); // Ajusta la ruta según la ubicación real del archivo

const app = express();
const port = 3000;

const productManager = new ProductManager();

// Cargar productos desde el archivo products.json al iniciar la aplicación
const productsFilePath = path.join(__dirname, 'products.json');

try {
  const productsData = fs.readFileSync(productsFilePath, 'utf8');
  const products = JSON.parse(productsData);
  products.forEach((product) => {
    productManager.addProduct(product);
  });
} catch (error) {
  console.error('Error al cargar productos desde el archivo:', error.message);
}

// Ruta para obtener todos los productos
app.get('/products', (req, res) => {
  const { limit } = req.query;

  let allProducts = productManager.getAllProducts();

  // Si se proporciona un límite, ajusta la lista de productos
  if (limit) {
    const limitNumber = parseInt(limit);
    allProducts = allProducts.slice(0, limitNumber);
  }

  res.json(allProducts);
});

app.post('/products', (req, res) => {
  const newProduct = req.body;
  productManager.addProduct(newProduct);
  res.send('Product added successfully');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
