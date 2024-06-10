// Import the product service instance and Product constructor
import { productService } from './product.mock.service.js';
import { Product } from './product.js';

// Function to validate the product form
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

    const cost = form.cost.value.trim();
    const eleCostError = document.getElementById('cost-error');

    if (cost === "" || isNaN(parseFloat(cost))) {
        valid = false;
        eleCostError.classList.remove('d-none');
        eleCostError.textContent = "You must enter a valid cost for the product.";
    } else {
        eleCostError.classList.add('d-none');
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
    if (params.has('name') && params.get('name').trim() !== "") {
        console.log("Parameter found");
        const productName = params.get('name').trim();
        // You can add code here to populate the form for editing if needed
    } else {
        // If there are no valid search parameters, attach event handler to form submit
        document.getElementById('add-form').addEventListener('submit', submitProductForm);
    }
});

// Function to handle form submission
function submitProductForm(event) {
    event.preventDefault();

    // Validate form fields
    const productForm = event.target;
    const isValid = validateProductForm(productForm);

    if (isValid) {
        // Log form values 
        console.log(`name: ${productForm.name.value}`);
        console.log(`cost: ${productForm.cost.value}`);
        console.log(`stock: ${productForm.stock.value}`);
        console.log(`description: ${productForm.description.value}`);

        // Create new Product object
        const newProduct = new Product(
            productForm.name.value.trim(),
            parseFloat(productForm.cost.value.trim()).toFixed(2),
            parseInt(productForm.stock.value.trim()),
            productForm.description.value.trim()
        );

        // Store the product using ProductService (mocked service)
        const isSuccess = productService.addProduct(newProduct);

        if (isSuccess) {
            // Redirect to list.html if product is successfully stored
            window.location.href = 'list.html';
        } else {
            console.error('Failed to store the product. Product may already exist.');
            // Handle error scenario if needed
        }
    }
}
