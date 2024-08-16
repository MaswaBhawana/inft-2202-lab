import tmplCreate from './create-product.ejs';
import productService from '../../services/product.service.js';

export default async () => {
    const initialData = await onInit();

    const strCreate = tmplCreate({
        ...initialData
    });

    const container = document.getElementById('app');
    container.innerHTML = '';  // Clear the previous content
    container.insertAdjacentHTML("afterbegin", strCreate);

    onRender(initialData);
}

/* 
 *  Stuff to do right before the template gets rendered
 *  Prepare the data that the template might need to use
 */
async function onInit() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    let isEdit = false;
    let productData = {};

    if (productId) {
        isEdit = true;
        productData = await productService.findProduct(productId);
    }

    return { isEdit, product: productData };
}

/* 
 *  Stuff to do right after the template gets rendered
 */
function onRender({ isEdit, product }) {
    const form = document.getElementById('add-form');

    if (isEdit && product) {
        document.getElementById('form-heading').textContent = "Edit Product";
        document.getElementById('submit').textContent = "Update Product";

        form.name.value = product.name;
        form.price.value = product.price;
        form.stock.value = product.stock;
        form.description.value = product.description;

        form.addEventListener('submit', (event) => submitProductForm(event, product._id));
    } else {
        form.addEventListener('submit', submitProductForm);
    }
}

/**
 * Validate the product form fields
 */
function validateProductForm(form) {
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

/**
 * Handle form submission
 */
async function submitProductForm(event, productId = null) {
    event.preventDefault();

    const productForm = event.target;
    const isValid = validateProductForm(productForm);

    if (isValid) {
        const name = productForm.name.value.trim();
        const price = parseFloat(productForm.price.value.trim());
        const stock = parseInt(productForm.stock.value.trim());
        const description = productForm.description.value.trim();

        const productData = { name, price, stock, description };

        try {
            if (productId) {
                await productService.updateProduct(productId, productData);
            } else {
                await productService.addProduct(productData);
            }
            window.location.href = '/list';
        } catch (error) {
            console.error('Failed to save the product. Error:', error.message);
            alert('Failed to save the product. Please try again.');
        }
    } else {
        console.log('Form validation failed');
    }
}
