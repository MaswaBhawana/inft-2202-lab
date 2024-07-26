import Product from "../../models/Products.js";

import { checkSchema } from "express-validator";

const rules = checkSchema({
    page: {
        isNumeric: true,
        errorMessage: `"page" must be a Number!`,
        
    },
    perPage: {
        isNumeric: true,
        errorMessage: `"perPage" must be a Number!`,
       
    }
}, ['query']);

const handle = async (request, response, next) => {
    try{
       
       const { page = 1 , perPage = 5 } = request.query;
 
       const where = {};
       const fields = {};
       const opts = {skip: (page-1) * perPage,
        limit: perPage,
        sort: {
         createAt: -1
        }
    };
 
       const count = await Product.countDocuments(where);
       const pages = Math.ceil(count/perPage)
 
       const pagination = {
        page: parseInt(page),
        perPage: parseInt(perPage),
        count,
        pages}
       
       const records = await Product.find(where, fields, opts);
 
        response.json({pagination, records});
 
 
    }catch (error){
        next(error);
    }
}
export default {handle, rules};
