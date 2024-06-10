// Constructor function for creating Product objects
export function Product(name, cost, stock, description) {  
    this.name = name;  
    this.cost = parseFloat(cost).toFixed(2);  
    this.stock = parseInt(stock, 10);  
    this.description = description;  
  }
  
  // Adding a method to the prototype  
  Product.prototype.toString = function() {  
    return `Product Name: ${this.name}\nCost: $${this.cost}\nStock: ${this.stock}\nDescription: ${this.description}`;  
  };
  