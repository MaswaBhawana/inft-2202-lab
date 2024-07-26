import Product from '../../models/Products.js';
import { checkSchema, validationResult } from 'express-validator'; // Import validationResult

// Define validation rules
const rules = checkSchema({
    name: {
        notEmpty: true,
        errorMessage: `"name" must be a non-empty string!`
    },
    price: {
        isNumeric: true,
        notEmpty: true,
        errorMessage: `"price" must be a non-empty string!`
    },
    stock: {
        isNumeric: true,
        notEmpty: true,
        errorMessage: `"stock" must be a non-empty integer!`
    },
    description: {
        notEmpty: true,
        errorMessage: `"description" must be a non-empty string!`
    }
}, ['body']); 

// Define the handle method for the update operation
const handle = async (request, response, next) => {
    try {
        // Validate request
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }

        const { name, price, stock, description } = request.body;
        const productId = request.params.productId;

        // Check if required fields are present (not strictly necessary if using validation middleware)
        if (!name || !price || !stock || !description) {
            return response.status(400).json({ error: "All required fields must be provided." });
        }

        // Update the Product
        const product = await Product.findOneAndUpdate(
            { _id: productId },
            { name, price, stock, description },
            { new: true, runValidators: true }
        );

        if (!product) {
            return response.status(404).json({ error: "Product not found." });
        }

        response.json(product);

    } catch (error) {
        next(error);
    }
};

export default { handle, rules };
