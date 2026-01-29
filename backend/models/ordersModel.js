import mongoose, { Schema, Types } from 'mongoose';

// Order Schema
const orderSchema = new Schema({
  tableId: {
    type: Types.ObjectId,        // Reference to a Table
    ref: "tables",
    required: true
  },
  userId: {
    type: Types.ObjectId,        // Reference to a User
    ref: "users",
    required: true
  },
  items: [
    {
      productId: {
        type: Types.ObjectId,    // Reference to a Product
        ref: "products",
        required: true
      },
      quantity: { type: Number, default: 1 },
    }
  ],
  total: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ["reservation", "order"],
    default: "order"
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "served", "canceled"],
    default: "pending"
  },
  reservationTime: Date, // Only for reservations
  orderTime: { type: Date, default: Date.now },
}, { timestamps: true });

// Export model
export const OrdersModel = mongoose.model("orders", orderSchema);
