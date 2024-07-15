import productService from './product.service.js';
import { Product } from './product.js';

export function validateProductForm(form) {
    let valid = true;

    const name = form.name.value.trim();
    const eleNameError = document.getElementById('name-error');

    if (name === "") {
        valid = false;
        eleNameError.classList.remove('d-none');
        eleNameError.textContent = "You must enter the name of the product.";
    } else {
        eleNameError.classList.add('d-none');
    }

    const price = form.price.value.trim();
    const elePriceError = document.getElementById('price-error');

    if (price === "" || isNaN(parseFloat(price))) {
        valid = false;
        elePriceError.classList.remove('d-none');
        elePriceError.textContent = "You must enter a valid price for the product.";
    } else {
        elePriceError.classList.add('d-none');
    }

    const stock = form.stock.value.trim();
    const eleStockError = document.getElementById('stock-error');

    if (stock === "" || isNaN(parseInt(stock))) {
        valid = false;
        eleStockError.classList.remove('d-none');
        eleStockError.textContent = "You must enter a valid number of products in stock.";
    } else {
        eleStockError.classList.add('d-none');
    }

    const description = form.description.value.trim();
    const eleDescriptionError = document.getElementById('description-error');

    if (description === "") {
        valid = false;
        eleDescriptionError.classList.remove('d-none');
        eleDescriptionError.textContent = "You must enter the description of the product.";
    } else {
        eleDescriptionError.classList.add('d-none');
    }

    return valid;
}

// Check if there are search parameters in the URL
document.addEventListener('DOMContentLoaded', function() {
    let params = new URL(document.location).searchParams;
    if (params.has('id') && params.get('id').trim() !== "") {
        console.log("Parameter found");
        const productId = params.get('id').trim();
        // You can add code here to populate the form for editing if needed
    } else {
        // If there are no valid search parameters, attach event handler to form submit
        document.getElementById('add-form').addEventListener('submit', submitProductForm);
    }
});

async function submitProductForm(event) {
    event.preventDefault();

    // Validate form fields
    const productForm = event.target;
    const isValid = validateProductForm(productForm);

    if (isValid) {
        // Log form values 
        console.log(`name: ${productForm.name.value}`);
        console.log(`price: ${productForm.price.value}`);
        console.log(`stock: ${productForm.stock.value}`);
        console.log(`description: ${productForm.description.value}`);

        // Create new Product object
        const newProduct = new Product(
            productForm.name.value.trim(),
            productForm.price.value.trim(), // Keep it as string for now
            productForm.stock.value.trim(),  // Keep it as string for now
            productForm.description.value.trim()
        );

        try {
            console.log('Adding product:', newProduct); // Log the product being added
            // Store the product using ProductService
            await productService.addProduct(newProduct);
            console.log('Product added successfully'); // Log success
            // Redirect to list.html if product is successfully stored
            window.location.href = 'list.html';
        } catch (error) {
            console.error('Failed to store the product. Product may already exist.', error);
            alert('Failed to store the product. Product may already exist.'); // Display the error to the user
        }
    } else {
        console.log('Form validation failed'); // Log form validation failure
    }
}
