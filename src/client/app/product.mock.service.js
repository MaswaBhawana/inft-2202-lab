// Import the product constructor
import { Product } from './product.js';

// Constructor function for ProductService
function ProductService() {
    const products = localStorage.getItem('products');
    if (!products) {
        localStorage.setItem('products', JSON.stringify([]));
    }
}

ProductService.prototype.listProducts = function() {
    const products = JSON.parse(localStorage.getItem('products'));
    return products.map(p => new Product(p.name, p.price, p.stock, p.description));
};

ProductService.prototype.findProduct = function(name) {
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(p => p.name === name);
    return product ? new Product(product.name, product.price, product.stock, product.description) : null;
};

ProductService.prototype.addProduct = function(product) {
    const products = JSON.parse(localStorage.getItem('products'));
    if (products.find(p => p.name === product.name)) {
        console.error('Error adding product. The product already exists.')
        return false;
    }
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    return true;
};

ProductService.prototype.updateProduct = function(updatedProduct) {
    let products = JSON.parse(localStorage.getItem('products'));
    const index = products.findIndex(p => p.name === updatedProduct.name);
    if (index === -1) {
        return false; // Product not found
    }
    products[index] = updatedProduct;
    localStorage.setItem('products', JSON.stringify(products));
    return true; // Product updated successfully
};

ProductService.prototype.deleteProduct = function(name) {
    let products = JSON.parse(localStorage.getItem('products'));
    const initialLength = products.length;
    products = products.filter(p => p.name !== name);
    localStorage.setItem('products', JSON.stringify(products));
    return products.length < initialLength;
};

// Export a new instance of ProductService
export const productService = new ProductService();
