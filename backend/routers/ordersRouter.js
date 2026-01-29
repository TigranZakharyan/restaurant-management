import { Router } from "express";
import * as Controller from "../controllers/ordersController.js";

const ordersRouter = Router();

ordersRouter.post("/", Controller.createOrder);
ordersRouter.get("/", Controller.getOrders);
ordersRouter.get("/table/:tableId", Controller.getOrdersByTable);
ordersRouter.post("/:id/items", Controller.addItemToOrder);
ordersRouter.post("/:id", Controller.payOrder);
ordersRouter.get("/:id", Controller.getOrderById);
ordersRouter.patch("/:id/status", Controller.updateOrderStatus);
ordersRouter.delete("/:id/items/:productId", Controller.removeItemFromOrder);
ordersRouter.delete("/:id", Controller.deleteOrder);

export { ordersRouter };
