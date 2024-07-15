const API_BASE_URL = 'https://inft2202.paclan.net/api/products';
const API_KEY = '6671c508f6855731eec497fa';

// Constructor function for ProductService
function ProductService(host, apikey) {
    this.host = host;
    this.apikey = apikey;
}

// Helper function to fetch data
async function fetchData(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
    return await response.json();
}

// List Products with pagination
ProductService.prototype.listProducts = async function (page, perPage) {
    const url = new URL(this.host);
    url.searchParams.append('page', page);
    url.searchParams.append('perPage', perPage);

    const options = {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            'apikey': this.apikey,
        }
    };

    try {
        const data = await fetchData(url, options);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data);
            }, 1000);
        });
    } catch (err) {
        console.error('Error listing products:', err);
        throw new Error('Failed to list products. Please try again.');
    }
}

// Find Product by ID
ProductService.prototype.findProduct = async function (productId) {
    const url = new URL(`${this.host}/${productId}`);
    const options = {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            'apikey': this.apikey,
        }
    };

    try {
        const data = await fetchData(url, options);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data);
            }, 1000);
        });
    } catch (err) {
        console.error('Error finding product:', err);
        throw new Error('Failed to find product. Please try again.');
    }
}

// Add Product
ProductService.prototype.addProduct = async function (product) {
    const url = this.host;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': this.apikey
        },
        body: JSON.stringify(product)
    };

    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            const errorMessage = await res.text();
            throw new Error(errorMessage);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(res.json());
            }, 1000);
        });
    } catch (err) {
        console.error('Error adding product:', err);
        throw new Error('Failed to add product. Please try again.');
    }
}

// Update Product by ID
ProductService.prototype.updateProduct = async function (productId, productData) {
    const url = new URL(`${this.host}/${productId}`);
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'apikey': this.apikey,
        },
        body: JSON.stringify(productData)
    };

    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            const errorMessage = await res.text();
            throw new Error(errorMessage);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(res.json());
            }, 1000);
        });
    } catch (err) {
        console.error('Error updating product:', err);
        throw new Error('Failed to update product. Please try again.');
    }
}

// Delete Product by ID
ProductService.prototype.deleteProduct = async function (productId) {
    const url = new URL(`${this.host}/${productId}`);
    console.log('Deleting product with ID:', productId); // Log the product ID
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'apikey': this.apikey,
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Failed to delete product:', errorMessage); // Log error message
            throw new Error(errorMessage);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    } catch (err) {
        console.error('Error deleting product:', err);
        throw new Error('Failed to delete product. Please try again.');
    }
}

// Export an instance of ProductService
const productService = new ProductService(API_BASE_URL, API_KEY);
export default productService;
