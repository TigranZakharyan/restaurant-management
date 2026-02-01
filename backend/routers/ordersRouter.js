import { Router } from "express";
import * as Controller from "../controllers/ordersController.js";
import { Auth } from "../core/auth.js";

const ordersRouter = Router();

ordersRouter.post("/", Auth.authorization, Controller.createOrder);
ordersRouter.get("/", Auth.authorization, Controller.getOrders);
ordersRouter.get("/table/:tableId", Auth.authorization, Auth.authorization, Controller.getOrdersByTable);
ordersRouter.post("/:id/items", Auth.authorization, Controller.addItemToOrder);
ordersRouter.post("/:id", Auth.authorization, Controller.payOrder);
ordersRouter.get("/:id", Auth.authorization, Controller.getOrderById);
ordersRouter.patch("/:id/status", Auth.authorization, Controller.updateOrderStatus);
ordersRouter.delete("/:id/items/:productId", Auth.authorization, Controller.removeItemFromOrder);
ordersRouter.delete("/:id", Auth.authorization, Controller.deleteOrder);

export { ordersRouter };
