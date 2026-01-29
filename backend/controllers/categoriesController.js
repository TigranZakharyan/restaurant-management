import { CategoriesModel } from "../models/categories.js";

export const getCategories = async (req, res) => {
  const categories = await CategoriesModel.find({});
  res.json(categories);
};

