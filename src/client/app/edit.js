// edit.js

import { productService } from './product.mock.service.js';
import { validateProductForm } from './add.js';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URL(document.location).searchParams;
    const name = params.get("name");

    if (!name) {
        console.error("No 'name' parameter found in the URL.");
        return;
    }

    setupEditForm(name);
});

function setupEditForm(name) {
    const heading = document.getElementById('form-heading');
    heading.textContent = "Edit Product";

    const product = productService.findProduct(name);
    if (!product) {
        console.error(`No product found with name: ${name}`);
        return;
    }

    const productForm = document.getElementById('add-form');
    populateForm(productForm, product); // Assuming populateForm function exists and populates the form fields
    productForm.name.disabled = true;

    const button = document.getElementById('submit');
    button.textContent = "Update Product";

    productForm.addEventListener('submit', (event) => submitEditForm(event, product));
}

function submitEditForm(event, originalProduct) {
    event.preventDefault();

    const productForm = event.target;
    const updatedProduct = extractFormData(productForm);

    const valid = validateProductForm(productForm);
    if (!valid) {
        return; // Stop further processing if form validation fails
    }

    if (productService.updateProduct(updatedProduct)) {
        window.location.href = "list.html";
    } else {
        const errorElement = document.getElementById('name-error');
        if (errorElement) {
            errorElement.textContent = "Update failed. Try again.";
        } else {
            console.error("Failed to update product.");
        }
    }
}

function extractFormData(form) {
    return {
        name: form.name.value,
        price: parseFloat(form.price.value),
        stock: parseInt(form.stock.value),
        description: form.description.value,
    };
}

function populateForm(form, product) {
    form.name.value = product.name;
    form.price.value = product.price;
    form.stock.value = product.stock;
    form.description.value = product.description;
}
