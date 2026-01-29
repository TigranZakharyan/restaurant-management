import { ProductsModel } from "../models/productsModel.js";

export const getProducts = async (req, res) => {
  const { categoryId } = req.query;
  const products = await ProductsModel.find({ categoryId });
  res.json(products);
};

