import { Router } from "express";
import * as Controller from "../controllers/authController.js";
import { Auth } from "../core/auth.js";

const authRouter = Router();

authRouter.post("/login", Controller.login);
authRouter.post("/logout", Auth.authorization, Controller.logout);
authRouter.get("/me", Auth.authorization, Controller.getMe);

export { authRouter };
