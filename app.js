const express = require('express');
const bodyParser = require('body-parser');
const ProductManager = require('./ProductManager'); 

const app = express();
const port = 3000;

const productManager = new ProductManager();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hola');
});

app.get('/products', (req, res) => {
  const allProducts = productManager.getAllProducts();
  res.json(allProducts);
});

app.post('/products', (req, res) => {
  const newProduct = req.body;
  productManager.addProduct(newProduct);
  res.send('producto añadido');
});

app.listen(port, () => {
  console.log(`escuchando puerto ${port}`);
});
