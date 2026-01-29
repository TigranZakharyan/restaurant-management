import { Router } from "express";
import * as Controller from "../controllers/usersController.js";

const usersRouter = Router();

usersRouter.get("/", Controller.getUsers);

export { usersRouter };
