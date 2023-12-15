const express = require('express');
const ProductManager = require('./ProductManager'); 
const app = express();
const port = 3000;



const productManager = new ProductManager();



app.get('/products.json', (req, res) => {
  const allProducts = productManager.getAllProducts();
  res.json(allProducts);
});

app.post('/products.json', (req, res) => {
  const newProduct = req.body; 
  productManager.addProduct(newProduct);
  res.send('Producto añadido');
});

app.listen(port, () => {
  console.log(`escuchando en puerto ${port}`);
});
