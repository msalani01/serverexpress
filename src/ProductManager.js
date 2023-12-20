const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error al cargar productos desde el archivo ${this.filePath}: ${error.message}`);
      return [];
    }
  }

  saveProducts() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
  }

  addProduct({ title, description, price, thumbnail, code, stock }) {
    const newProduct = {
      id: this.getNextId(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  getAllProducts() {
    return this.products;
  }

  getProductById(productId) {
    return this.products.find(product => product.id === productId);
  }

  getNextId() {
    return this.products.length > 0 ? Math.max(...this.products.map(product => product.id)) + 1 : 1;
  }

  getProduct(productId) {
    return this.products.find(product => product.id === productId);
  }

  updateProduct(productId, newData) {
    const index = this.products.findIndex(product => product.id === productId);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...newData };
      this.saveProducts();
      return true;
    }
    return false;
  }

  deleteProduct(productId) {
    this.products = this.products.filter(product => product.id !== productId);
    this.saveProducts();
  }
}


const pm = new ProductManager('Products.json');
const product = pm.getProductById(2);
console.log(product);

module.exports = ProductManager;