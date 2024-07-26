import express from 'express';
import ProductsCreateController from '../controllers/products/create.js';
import ProductsRetrieveController from '../controllers/products/retrieve.js';
import ProductsDeleteController from '../controllers/products/delete.js';
import ProductsUpdateController from '../controllers/products/update.js';
import ProductsSearchController from '../controllers/products/search.js';

import { CheckValidation } from '../middleware/validation.js';

export const productRoutes = express.Router();


// Search
productRoutes.get(
    '/products',
    CheckValidation(ProductsSearchController.rules),
    ProductsSearchController.handle
)

// Create
productRoutes.post(
    '/products',
    CheckValidation(ProductsCreateController.rules),
    ProductsCreateController.handle
)

// Update
productRoutes.put(
    '/products/:productId',
    CheckValidation(ProductsUpdateController.rules),
    ProductsUpdateController.handle
);

// Retrieve
productRoutes.get(
    '/products/:productId',
    CheckValidation(ProductsRetrieveController.rules),
    ProductsRetrieveController.handle
);

// Delete
productRoutes.delete(
    '/products/:productId',
    CheckValidation(ProductsDeleteController.rules),
    ProductsDeleteController.handle
);

