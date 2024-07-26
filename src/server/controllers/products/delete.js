import Product from '../../models/Products.js';
import { checkSchema } from 'express-validator';

const rules = checkSchema({
    productId: {
        in: ['params'],
        isMongoId: {
            errorMessage: '"productId" must be a valid MongoDB ID!'
        }
    }
});

const handle = async (request, response, next) => {
    try {
        const product = await Product.findOneAndDelete({
            _id: request.params.productId
        });

        if (!product) {
            return response.status(404).json({ error: "Product not found." });
        }

        response.json({ message: "Product deleted successfully." });

    } catch (error) {
        next(error);
    }
};

export default {
    rules,
    handle
};
