// product.js
export function Product(name, price, stock, description) {
  this.name = name;
  this.price = parseFloat(price).toFixed(2);  // Ensure the price is correctly parsed as a float and fixed to 2 decimal places
  this.stock = parseInt(stock, 10);  // Ensure stock is parsed as an integer
  this.description = description;
}

// Adding a method to the prototype for debugging purposes
Product.prototype.toString = function() {
  return `Product Name: ${this.name}\nPrice: $${this.price}\nStock: ${this.stock}\nDescription: ${this.description}`;
};
