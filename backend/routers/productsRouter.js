import { Router } from "express";
import * as Controller from "../controllers/productsController.js";
import { Auth } from "../core/auth.js";

const productsRouter = Router();

productsRouter.get("/", Auth.authorization, Controller.getProducts);

export { productsRouter }