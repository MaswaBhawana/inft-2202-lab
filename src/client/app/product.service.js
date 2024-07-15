const API_BASE_URL = 'https://inft2202.paclan.net/api/products';
const API_KEY = '6671c508f6855731eec497fa';

async function fetchData(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
    return await response.json();
}

// List Products with pagination
export async function listProducts(page, perPage) {
    const url = new URL(API_BASE_URL);
    url.searchParams.append('page', page);
    url.searchParams.append('perPage', perPage);

    const options = {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            'apikey': API_KEY,
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
export async function findProduct(productId) {
    const url = new URL(`${API_BASE_URL}/${productId}`);
    const options = {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            'apikey': API_KEY,
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
export async function addProduct(product) {
    const url = API_BASE_URL;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': API_KEY
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
// Update Product by ID
export async function updateProduct(productId, productData) {
  const url = new URL(`${API_BASE_URL}/${productId}`);
  const options = {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          'apikey': API_KEY,
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
export async function deleteProduct(productId) {
    const url = new URL(`${API_BASE_URL}/${productId}`);
    console.log('Deleting product with ID:', productId); // Log the product ID
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'apikey': API_KEY,
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
