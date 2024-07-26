import Product from '../../models/Products.js';
import { NotFoundError } from '../../errors/NotFoundError.js';
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
        const product = await Product.findOne({
            _id: request.params.productId
        });
        if (!product) {
            throw new NotFoundError('Could not find that product.');
        }
        response.json(product);
    } catch (error) {
        next(error);
    }
};

export default {
    rules,
    handle
};
