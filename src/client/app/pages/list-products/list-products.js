import tmplList from './list-products.ejs';
import productService from '../../services/product.service.js'; // Adjust the path as necessary

export default async () => {
    const container = document.getElementById('app');
    container.innerHTML = '';  // Clear the previous content

    // Render the EJS template into the container
    const strList = tmplList();
    container.insertAdjacentHTML("afterbegin", strList);

    // Initialize DOM elements and variables
    const messageBox = document.getElementById('messageAlert');
    const productContainer = document.getElementById('products-container');
    const paginationContainer = document.getElementById('pagination');
    const perPageSelect = document.getElementById('perPageSelect');
    const spinner = document.getElementById("spinner");

    let perPage = parseInt(perPageSelect.value);
    let currentPage = getCurrentPage();
    let deleteProductId = null;

    // Fetch and display products
    async function fetchProducts() {
        showSpinner();
        try {
            const productsData = await productService.listProducts(currentPage, perPage);
            console.log('API Response:', productsData);

            const products = productsData.records || productsData.data || productsData;
            if (!products) {
                throw new Error('Products data is not defined');
            }

            console.log('Fetched Products:', products);
            drawProductCards(products);
            drawPagination(productsData.pagination.count, productsData.pagination.page, productsData.pagination.perPage);
        } catch (error) {
            console.error('Error fetching products:', error);
            showMessage('Error fetching products. Please try again later.', 'danger');
        } finally {
            hideSpinner();
        }
    }

    // Event listener for changing the number of products per page
    perPageSelect.addEventListener('change', async () => {
        perPage = parseInt(perPageSelect.value);
        currentPage = 1; // Reset to the first page when changing perPage
        updateURL();
        await fetchProducts();
    });

    // Draw product cards based on the fetched products
    function drawProductCards(products) {
        if (products.length === 0) {
            showMessage('No products found.', 'info');
            productContainer.classList.add('d-none');
            paginationContainer.innerHTML = '';
            return;
        } else {
            messageBox.classList.add('d-none');
            productContainer.classList.remove('d-none');
        }

        productContainer.innerHTML = '';

        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('card', 'col-md-4', 'col-sm-6', 'mb-4');

            const listedAt = new Date(product.createdAt).toLocaleString(); // Format the date

            card.innerHTML = `
                <img src="https://cdn.australia247.info/assets/uploads/5627c3e0ca74272f061b5c71107cc361_-new-south-wales-newcastle-city-council-new-lambton-miskonduct-klothing-02-4048-0455html.jpg" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">Price: ${product.price}</p>
                    <p class="card-text">Stock: ${product.stock}</p>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><strong>Listed At:</strong> ${listedAt}</p>
                    <button class="btn btn-danger delete-button" data-product-id="${product._id}" data-bs-toggle="modal" data-bs-target="#deleteConfirmationModal"><i class="fa fa-trash"></i></button>
                    <a href="add.html?id=${product._id}" class="btn btn-primary"><i class="fa fa-edit"></i></a>
                </div>
            `;

            productContainer.appendChild(card);
        });

        // Initialize delete button event listeners
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                deleteProductId = event.currentTarget.getAttribute('data-product-id');
                console.log('Delete product ID:', deleteProductId);
            });
        });

        const confirmDeleteButton = document.getElementById('confirmDeleteButton');
        confirmDeleteButton.addEventListener('click', async () => {
            if (!deleteProductId) {
                console.error('No product ID set for deletion.');
                return;
            }
            showSpinner();
            try {
                console.log(`Deleting product with ID: ${deleteProductId}`);
                await productService.deleteProduct(deleteProductId);
                showMessage('Product deleted successfully.', 'success');
                const deleteConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
                deleteConfirmationModal.hide();
                await fetchProducts(); // Fetch and redraw products after deletion
            } catch (error) {
                console.error('Error deleting product:', error);
                showMessage('Error deleting product. Please try again later.', 'danger');
            } finally {
                hideSpinner();
            }
        });
    }

    // Draw pagination based on the total number of products
    function drawPagination(totalItems, currentPage, perPage) {
        const totalPages = Math.ceil(totalItems / perPage);
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) {
            return;
        }

        const paginationList = document.createElement('ul');
        paginationList.classList.add('pagination');

        const prevButton = createPaginationButton('Previous', currentPage > 1 ? currentPage - 1 : currentPage, 'page-link', currentPage > 1);
        paginationList.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = createPaginationButton(i, i, 'page-link', true, currentPage === i);
            paginationList.appendChild(pageButton);
        }

        const nextButton = createPaginationButton('Next', currentPage < totalPages ? currentPage + 1 : currentPage, 'page-link', currentPage < totalPages);
        paginationList.appendChild(nextButton);

        paginationContainer.appendChild(paginationList);
    }

    // Helper function to create pagination buttons
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
        link.href = `?page=${page}`;
        link.addEventListener('click', (event) => {
            event.preventDefault();
            if (isEnabled && !isActive) {
                currentPage = page;
                fetchProducts();
                updateURL();
            }
        });

        paginationItem.appendChild(link);
        return paginationItem;
    }

    // Get the current page from the URL
    function getCurrentPage() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('page')) || 1;
    }

    // Update the URL with the current page and perPage values
    function updateURL() {
        const url = new URL(window.location);
        url.searchParams.set('page', currentPage);
        url.searchParams.set('perPage', perPage);
        window.history.pushState({}, '', url);
    }

    // Show a message in the alert box
    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.className = `alert alert-${type}`;
        messageBox.classList.remove('d-none');
    }

    // Show the loading spinner
    function showSpinner() {
        console.log("Showing spinner");
        spinner.classList.remove("d-none");
        spinner.classList.add("show");
    }

    // Hide the loading spinner
    function hideSpinner() {
        console.log("Hiding spinner");
        spinner.classList.add("d-none");
        spinner.classList.remove("show");
    }

    // Fetch the products when the page is loaded
    fetchProducts();
};
