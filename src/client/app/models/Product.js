// product.js
export function Product(name, price, stock, description) {
    this.name = name;
    this.price = parseFloat(price).toFixed(2);  
    this.stock = parseInt(stock, 10);  
    this.description = description;
  }
  
  
  Product.prototype.toString = function() {
    return `Product Name: ${this.name}\nPrice: $${this.price}\nStock: ${this.stock}\nDescription: ${this.description}`;
  };
  