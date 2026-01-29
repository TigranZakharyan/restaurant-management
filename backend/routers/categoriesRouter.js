import { Router } from "express";
import * as Controller from "../controllers/categoriesController.js";
import { Auth } from "../core/auth.js";

const categoriesRouter = Router();

categoriesRouter.get("/", Auth.authorization, Controller.getCategories);

export { categoriesRouter };
