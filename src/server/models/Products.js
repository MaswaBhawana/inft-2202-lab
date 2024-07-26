// 
import { model, Model, Schema } from "mongoose";

// define the fielsds we want ot see in the database
const fields = {
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
};


// Create a mongoose schema
const schema = new Schema(fields);

// Use it to create and export a new model named 'Product'
export default model('Product', schema);
