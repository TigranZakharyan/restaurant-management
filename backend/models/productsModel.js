import mongoose, { Types } from 'mongoose';

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    categoryId: {
        type: Types.ObjectId,        // Reference to a User (who created the order/reservation)
        ref: "categories",                // Name of the User model
        required: true
    },
    price: {
        type: Number,
        require: true
    },
    unit: {
        type: String,
    },
    img: {
        type: String,
        default: null
    }
})

export const ProductsModel = mongoose.model('products', productsSchema);