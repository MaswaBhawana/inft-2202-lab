import tmplList from './list-products.ejs';
import productService from '../../services/product.service.js';
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.js'; // Importing only the Modal class

export default async () => {
    const container = document.getElementById('app');
    if (!container) {
        console.error("Container element with id 'app' not found.");
        return;
    }

    // Render the static parts of the list page first
    const initialHtml = `
        <div class="container">
            <h1 class="mt-5">List of Products</h1>

            <!-- Dropdown for selecting number of products per page -->
            <div class="mb-3">
                <label for="perPageSelect" class="form-label">Products per page:</label>
                <select id="perPageSelect" class="form-select" aria-label="Products per page">
                    <option value="2">2</option>
                    <option value="5" selected>5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </div>

            <!-- Product Cards Section -->
            <div id="products-container" class="cards row row-cols-1 row-cols-md-3 g-4"></div>

            <!-- Spinner -->
            <div class="text-center my-3 d-none" id="spinner">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>

            <!-- Pagination Section -->
            <nav id="pagination" aria-label="Page navigation">
                <ul class="pagination justify-content-center"></ul>
            </nav>

            <!-- Modal window to confirm deletion -->
            <div class="modal fade" id="deleteConfirmationModal" tabindex="-1" aria-labelledby="deleteConfirmationModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="deleteConfirmationModalLabel">Confirm Delete</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Are you sure you want to delete this product?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger" id="confirmDeleteButton">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = initialHtml;

    try {
        await fetchAndRenderProducts(); // Fetch products and render them
    } catch (error) {
        console.error('Error loading products:', error);
        showMessage('Failed to load products. Please try again later.', 'danger');
    }

    // Set up the event listener for the per-page dropdown
    document.getElementById('perPageSelect').addEventListener('change', async (event) => {
        const perPage = parseInt(event.target.value);
        await fetchAndRenderProducts(1, perPage); // Fetch products starting from the first page
    });
};

// Function to fetch and render the products
async function fetchAndRenderProducts(page = 1, perPage = 5) {
    const spinner = document.getElementById('spinner');
    const productsContainer = document.getElementById('products-container');

    if (spinner) {
        spinner.classList.remove('d-none'); // Show the spinner while loading products
    }

    try {
        const { products, pagination } = await onInit(page, perPage); // Fetch products and pagination data

        if (productsContainer) {
            const strProducts = tmplList({ products, renderDropdown: false });
            productsContainer.innerHTML = strProducts;
        }

        onRender(pagination); // Handle post-render tasks
    } finally {
        if (spinner) {
            spinner.classList.add('d-none'); // Hide the spinner once products are loaded
        }
    }
}

// Initialization function to set up necessary data before rendering
async function onInit(page, perPage) {
    // Fetch products from the API
    const { records: products, pagination } = await productService.listProducts(page, perPage);

    return { products, pagination };
}

// Finalization function to handle post-rendering tasks
function onRender(pagination) {
    setupPagination(pagination); // Set up pagination based on the data received

    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    let deleteProductId = null;

    // Setup click event for all delete buttons
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            deleteProductId = event.currentTarget.getAttribute('data-product-id');

            // Show the modal
            const deleteConfirmationModal = new Modal(document.getElementById('deleteConfirmationModal'));
            deleteConfirmationModal.show();
        });
    });

    // Handle deletion after confirmation
    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', async () => {
            if (!deleteProductId) {
                console.error('No product ID set for deletion.');
                return;
            }
            try {
                await productService.deleteProduct(deleteProductId);
                showMessage('Product deleted successfully.', 'success');

                // Close the modal
                const deleteConfirmationModal = Modal.getInstance(document.getElementById('deleteConfirmationModal'));
                if (deleteConfirmationModal) {
                    deleteConfirmationModal.hide();
                }

                await fetchAndRenderProducts(); // Fetch and redraw products after deletion
            } catch (error) {
                console.error('Error deleting product:', error);
                showMessage('Error deleting product. Please try again later.', 'danger');
            }
        });
    }
}

// Helper function to set up pagination
function setupPagination(pagination) {
    const paginationContainer = document.querySelector('#pagination ul');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = ''; // Clear existing pagination

    for (let page = 1; page <= pagination.pages; page++) {
        const li = document.createElement('li');
        const classList = ['page-item'];
        if (page === pagination.page) {
            classList.push('active');
        }
        li.className = classList.join(' ');

        const link = document.createElement('a');
        link.classList.add('page-link');
        link.href = `?page=${page}`;
        link.textContent = page;

        link.addEventListener('click', async (event) => {
            event.preventDefault();
            const perPage = parseInt(document.getElementById('perPageSelect').value);
            await fetchAndRenderProducts(page, perPage); // Fetch products for the selected page
        });

        li.appendChild(link);
        paginationContainer.appendChild(li);
    }
}

// Helper function to get the current page from the URL
function getCurrentPage() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('page')) || 1;
}

// Function to display a message to the user
function showMessage(message, type) {
    const messageBox = document.getElementById('messageAlert');
    if (messageBox) {
        messageBox.textContent = message;
        messageBox.className = `alert alert-${type}`;
        messageBox.classList.remove('d-none');
    }
}
