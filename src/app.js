const express = require('express');
const fs = require('fs').promises; 
const path = require('path'); 
const ProductManager = require('./ProductManager'); 
const session = require('express-session');
const app = express();
const port = 8080;
const router = express.Router(); 


app.use('/api/carts', router);

const productManager = new ProductManager('C:/Users/M/Documents/Dev/Servidor_Express/src/products.json');


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

const carts = [];

router.post('/', (req, res) => {
  // Generar un ID único para el nuevo carrito
  const cartId = generateCartId();

  // Crear un nuevo carrito con la estructura requerida
  const newCart = {
    id: cartId,
    products: [],
  };

  // Agregar el nuevo carrito al array de carritos
  carts.push(newCart);

  res.status(201).json(newCart);
});

function generateCartId() {
  return Math.random().toString(36).substr(2, 9);
}


module.exports = router;


// Ruta para agregar un producto al carrito
router.post('/:cartId/products/', (req, res) => {
  const cartId = req.params.cartId;
  const productId = req.body.productId; // Suponiendo que se proporciona el ID del producto

  // Encontrar el carrito correspondiente por ID
  const cart = carts.find(cart => cart.id === cartId);

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  // Agregar el producto al carrito (puedes ajustar según tu lógica de productos)
  const productToAdd = productManager.getProductById(productId);

  if (!productToAdd) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  cart.products.push(productToAdd);

  res.status(201).json(cart);
});

module.exports = router;


app.get('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.put('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const { title, description, code, price, stock, category, thumbnails } = req.body;


  const existingProduct = productManager.getProductById(productId);

  if (!existingProduct) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }


  existingProduct.title = title || existingProduct.title;
  existingProduct.description = description || existingProduct.description;
  existingProduct.code = code || existingProduct.code;
  existingProduct.price = price || existingProduct.price;
  existingProduct.stock = stock || existingProduct.stock;
  existingProduct.category = category || existingProduct.category;
  existingProduct.thumbnails = thumbnails || existingProduct.thumbnails;


  productManager.saveProducts();


  res.status(200).json(existingProduct);
});

app.delete('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);

  
  const productIndex = productManager.getAllProducts().findIndex(product => product.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }


  productManager.getAllProducts().splice(productIndex, 1);


  productManager.saveProducts();

  res.status(204).send();
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
    status: true, 
    stock,
    category,
    thumbnails: thumbnails || [], 
  };


  productManager.addProduct(newProductcart);


  res.status(201).json(newProductcart);
  res.send('producto agregado');
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