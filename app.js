const express = require('express');
const bodyParser = require('body-parser');
const ProductManager = require('./ProductManager'); 

const app = express();
const port = 3000;

const productManager = new ProductManager();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


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
  console.log(`escuchando en puerto ${port}`);
});
