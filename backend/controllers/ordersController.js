import mongoose from "mongoose";
import { OrdersModel } from "../models/ordersModel.js";
import { ProductsModel } from "../models/productsModel.js";
import { TablesModel } from "../models/tablesModel.js";

export const createOrder = async (req, res) => {
  try {
    const { tableId, userId, items, type = "order", reservationTime } = req.body;

    if (!tableId || !userId || !items?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Calculate total from products
    const productIds = items.map((i) => i.productId);

    const products = await ProductsModel.find({
      _id: { $in: productIds },
    });

    let total = 0;

    items.forEach((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.productId
      );
      if (product) {
        total += product.price * item.quantity;
      }
    });

    const order = await OrdersModel.create({
      tableId,
      userId,
      items,
      total,
      type,
      reservationTime: type === "reservation" ? reservationTime : undefined,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

/**
 * GET ALL ORDERS
 */
export const getOrders = async (_, res) => {
  try {
    const orders = await OrdersModel.find()
      .populate("tableId")
      .populate("userId")
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/**
 * GET ORDERS BY TABLE
 */
export const getOrdersByTable = async (req, res) => {
  try {
    const { tableId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tableId)) {
      return res.status(400).json({ message: "Invalid table id" });
    }

    const orders = await OrdersModel.find({ tableId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch table orders" });
  }
};

/**
 * GET SINGLE ORDER
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await OrdersModel.findById(id)
      .populate("tableId")
      .populate("userId")
      .populate("items.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

/**
 * UPDATE ORDER STATUS
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "served", "canceled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await OrdersModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};

/**
 * ADD ITEM TO EXISTING ORDER
 */
export const addItemToOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity = 1 } = req.body;

    const product = await ProductsModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const order = await OrdersModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const existingItem = order.items.find(
      (i) => i.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      order.items.push({ productId, quantity });
    }

    order.total += product.price * quantity;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to add item" });
  }
};

/**
 * REMOVE ITEM FROM ORDER
 */
export const removeItemFromOrder = async (req, res) => {
  try {
    const { id, productId } = req.params;

    const order = await OrdersModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const item = order.items.find(
      (i) => i.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const product = await ProductsModel.findById(productId);
    if (product) {
      order.total -= product.price * item.quantity;
    }

    order.items = order.items.filter(
      (i) => i.productId.toString() !== productId
    );

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item" });
  }
};

/**
 * DELETE ORDER (ADMIN / CASHIER)
 */
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await OrdersModel.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete order" });
  }
};

export const payOrder = async (req, res) => {
  try {
    const { id } = req.params
    const order = await OrdersModel.findById(id);
    await TablesModel.findByIdAndUpdate(order.tableId, { 
      status: "free",
      orderId: null,
      seats: 0
    })

    res.json({ message: "Payment was successful" })

  } catch (err) {
    res.status(500).json({ message: "Failed to pay order" });
  }
}