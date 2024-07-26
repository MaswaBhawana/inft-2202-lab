import { ConflictError } from '../../errors/ConflictErrors.js';
import Product from '../../models/Products.js';
import { checkSchema } from 'express-validator';

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

const handle = async (request, response, next) => {
    try {
        const { name, price, stock, description } = request.body;
        const exists = await Product.findOne({name});
        if (exists) {
            throw new ConflictError('That product already exists.');
        }
        const product = await Product.create({
            name,
            price,
            stock,
            description
        });
        response.json(product);
    } catch (error) {
        next(error);
    }
};

export default { handle, rules };
