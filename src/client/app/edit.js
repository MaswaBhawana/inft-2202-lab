import { findProduct, updateProduct } from './product.service.js';
import { validateProductForm } from './add.js';

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URL(document.location).searchParams;
    const productId = params.get("id");

    if (!productId) {
        console.error("No 'id' parameter found in the URL.");
        return;
    }

    await setupEditForm(productId);
});

async function setupEditForm(productId) {
    const heading = document.getElementById('form-heading');
    heading.textContent = "Edit Product";

    try {
        const product = await findProduct(productId);
        if (!product) {
            console.error(`No product found with id: ${productId}`);
            return;
        }

        const productForm = document.getElementById('add-form');
        populateForm(productForm, product);
        productForm.name.disabled = true;

        const button = document.getElementById('submit');
        button.textContent = "Update Product";

        productForm.addEventListener('submit', (event) => submitEditForm(event, product));
    } catch (error) {
        console.error(`Error finding product: ${productId}`, error);
    }
}

async function submitEditForm(event, originalProduct) {
    event.preventDefault();

    const productForm = event.target;
    const updatedProduct = extractFormData(productForm);

    const valid = validateProductForm(productForm);
    if (!valid) {
        return; // Stop further processing if form validation fails
    }

    try {
        await updateProduct(originalProduct._id, updatedProduct);
        window.location.href = "list.html";
    } catch (error) {
        const errorElement = document.getElementById('name-error');
        if (errorElement) {
            errorElement.textContent = "Update failed. Try again.";
        } else {
            console.error("Failed to update product.", error);
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
