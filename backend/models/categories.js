import mongoose from 'mongoose';

const categoriesSchema = new mongoose.Schema({
    title: {
        type: String
    },
    img: {
        type: String
    }
})

export const CategoriesModel = mongoose.model('categories', categoriesSchema);