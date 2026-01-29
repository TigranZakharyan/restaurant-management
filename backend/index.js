import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from 'cookie-parser';

import { Config } from './core/config.js'

import AdminJSExpress from '@adminjs/express'
import adminJs from "./admin/admin.js";
import { authenticate } from "./admin/auth.js";

import { authRouter } from "./routers/authRouter.js";
import { usersRouter } from "./routers/usersRouter.js";
import { tablesRouter } from "./routers/tablesRouter.js";
import { productsRouter } from "./routers/productsRouter.js";
import { ordersRouter } from "./routers/ordersRouter.js";
import { categoriesRouter } from "./routers/categoriesRouter.js";

import { getAdminStats } from "./admin/statsController.js";

const app = express();

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate,
    cookieName: 'adminjs',
    cookiePassword: 'supersecret'
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
    secret: 'supersecret',
  }
)

const corsOptions = {
  credentials: true,
  origin: function(origin, callback) {
    if (!origin || true) {
      callback(null, true);
    }
  }
};
app.use(adminJs.options.rootPath, adminRouter)
app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ------------------ Admin ------------------ */

app.get('/admin/stats', getAdminStats)
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/tables", tablesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);

try {
  await mongoose.connect(Config.MONGODB_URL);
  console.log("✅ MongoDB connected");

  app.listen(Config.PORT, () => {
    console.log(`🚀 Server running on port ${Config.PORT}`);
  });
} catch (err) {
  console.error("❌ MongoDB connection failed:", err);
  process.exit(1);
}
