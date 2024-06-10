// Import the product service instance and Product constructor
import { productService } from './product.mock.service.js';
import { Product } from './product.js';

// Get a reference to the message box, pagination container, and product container
const messageBox = document.getElementById('messageAlert');
const paginationContainer = document.getElementById('pagination');
const productContainer = document.getElementById('products-container');

const perPage = 5; // Number of entries per page

// Fetch the list of products and draw the cards with pagination
fetchProducts();

function fetchProducts() {
    const products = productService.listProducts();
    const currentPage = getCurrentPage();
    const paginatedProducts = getPaginatedProducts(products, currentPage, perPage);
    drawProductCards(paginatedProducts, currentPage);
}

function getPaginatedProducts(products, currentPage, perPage) {
    const startIndex = (currentPage - 1) * perPage;
    return products.slice(startIndex, startIndex + perPage);
}

function drawProductCards(products, currentPage) {
    // Calculate pagination
    const totalPages = Math.ceil(productService.listProducts().length / perPage);

    // Show or hide the message box and cards based on the products list
    if (products.length === 0) {
        messageBox.classList.remove('d-none');
        productContainer.classList.add('d-none');
        paginationContainer.innerHTML = ''; // Clear pagination if no products
        return;
    } else {
        messageBox.classList.add('d-none');
        productContainer.classList.remove('d-none');
    }

    // Empty the product container before redrawing
    productContainer.innerHTML = '';

    // Create and add cards for each product
    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('card', 'col-md-4', 'col-sm-6', 'mb-4');

        card.innerHTML = `
            <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">Price: ${product.price}</p>
                <p class="card-text">Stock: ${product.stock}</p>
                <p class="card-text">${product.description}</p>
                <button class="btn btn-primary">Add to cart</button>
                <button class="btn btn-danger delete-button" data-product-id="${product.name}" data-bs-toggle="modal" data-bs-target="#deleteConfirmationModal"><i class="fa fa-trash"></i></button>
                <a href="add.html?name=${product.name}" class="btn btn-primary"><i class="fa fa-edit"></i></a>
            </div>
        `;

        productContainer.appendChild(card);
    });

    // Initialize delete button event listeners
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', event => {
            const productName = event.currentTarget.getAttribute('data-product-id');
            const confirmDeleteButton = document.getElementById('confirmDeleteButton');

            // Set up confirmation button click handler
            confirmDeleteButton.onclick = () => {
                // Delete the product using productService
                if (productService.deleteProduct(productName)) {
                    console.log(`Product '${productName}' deleted successfully.`);
                    // Hide modal and update product list
                    const deleteConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
                    deleteConfirmationModal.hide();
                    fetchProducts(); // Fetch and redraw products after deletion
                } else {
                    console.error(`Failed to delete product '${productName}'.`);
                }
            };
        });
    });

    // Draw pagination links
    drawPagination(paginationContainer, currentPage, totalPages);
}

function drawPagination(paginationElement, currentPage, totalPages) {
    paginationElement.innerHTML = ''; // Clear existing pagination

    if (totalPages <= 1) {
        return; // Hide pagination if there's only one page or no pages needed
    }

    const paginationList = document.createElement('ul');
    paginationList.classList.add('pagination');

    // Previous button
    const prevButton = createPaginationButton('Previous', currentPage > 1 ? currentPage - 1 : currentPage, 'page-link', currentPage > 1);
    paginationList.appendChild(prevButton);

    // Page buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = createPaginationButton(i, i, 'page-link', true, currentPage === i);
        paginationList.appendChild(pageButton);
    }

    // Next button
    const nextButton = createPaginationButton('Next', currentPage < totalPages ? currentPage + 1 : currentPage, 'page-link', currentPage < totalPages);
    paginationList.appendChild(nextButton);

    paginationElement.appendChild(paginationList);
}

function createPaginationButton(text, page, classes, isEnabled, isActive = false) {
    const paginationItem = document.createElement('li');
    paginationItem.classList.add('page-item');
    if (isActive) {
        paginationItem.classList.add('active');
    }
    if (!isEnabled) {
        paginationItem.classList.add('disabled');
    }

    const link = document.createElement('a');
    link.classList.add(classes);
    link.textContent = text;
    link.href = `?page=${page}`; // Update the URL with the page parameter
    link.addEventListener('click', (event) => {
        event.preventDefault();
        if (isEnabled && !isActive) {
            fetchProducts();
            updateURL(page);
        }
    });

    paginationItem.appendChild(link);
    return paginationItem;
}

function getCurrentPage() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('page')) || 1;
}

function updateURL(page) {
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url);
}
