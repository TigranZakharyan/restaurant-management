import mongoose, { Types } from "mongoose";

const tablesSchema = new mongoose.Schema({
  title: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["free", "reserved", "busy"],
    default: "free",
  },
  seats: {
    type: Number,
    default: 0,
  },
  orderId: {
    type: Types.ObjectId,       // Reference to the current order
    ref: "orders",              // Name of your orders collection
    default: null,
  },
});

// Export model (avoid recompilation errors)
export const TablesModel =
  mongoose.models.tables || mongoose.model("tables", tablesSchema);
