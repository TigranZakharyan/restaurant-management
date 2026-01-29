import { Router } from "express";
import * as Controller from "../controllers/tablesController.js";
import { Auth } from "../core/auth.js";

const tablesRouter = Router();

tablesRouter.get("/count", Auth.authorization, Controller.getTablesCount);
tablesRouter.post("/set/type", Auth.authorization, Controller.setType);
tablesRouter.get("/", Auth.authorization, Controller.getTables);
tablesRouter.put("/:id", Auth.authorization, Controller.updateTable);
tablesRouter.get("/:id", Auth.authorization, Controller.getTableById);

export { tablesRouter };
