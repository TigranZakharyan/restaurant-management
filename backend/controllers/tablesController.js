import { TablesModel } from "../models/tablesModel.js";
import { OrdersModel } from "../models/ordersModel.js";

/* ---------------- Tables ---------------- */

export const getTables = async (req, res) => {
  const tables = await TablesModel.find({});
  res.json(tables);
};

export const getTableById = async (req, res) => {
  try {
    const table = await TablesModel.findById(req.params.id)
      .populate({
        path: "orderId",               // The field in TablesModel
        populate: {                    // populate products inside order
          path: "items.productId",
          model: "products",
        },
      });

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.json(table);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTable = async (req, res) => {
  const { id } = req.params;
  const newData = req.body;

  try {
    const table = await TablesModel.findById(id);

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    // ---------------- HANDLE STATUS CHANGES ----------------
    if (newData.status) {
      // If changing to busy and no order exists, create new order
      if (newData.status === "busy" && !table.orderId) {
        const newOrder = await OrdersModel.create({
          tableId: table._id,
          userId: req.user._id,   // assign later if needed, or from req.user
          items: [],
          total: 0,
          status: "pending",
          type: "order",
        });

        newData.orderId = newOrder._id;
      }

      // If changing to free, reset seats and remove orderId
      if (newData.status === "free") {
        newData.seats = 0;
        newData.orderId = null;
      }
    }

    const updatedTable = await TablesModel.findByIdAndUpdate(id, newData, {
      new: true,
    });

    res.json(updatedTable);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const setType = async (req, res) => {
  const { title, clientsNumber, type } = req.body;

  await TablesModel.findOneAndUpdate(
    { title },
    { title, clientsNumber, type }
  );

  const tables = await TablesModel.find({});
  res.json(tables);
};

export const changeTable = async (req, res) => {
  const { currentTable, replaceTable } = req.body;

  const current = await TablesModel.findOne({ title: currentTable });
  const replace = await TablesModel.findOne({ title: replaceTable });

  if (!current || !replace) {
    return res.status(404).json({ message: "Table not found" });
  }

  const currentOrder = await OrdersModel.findOne({ table: currentTable });
  const replaceOrder = await OrdersModel.findOne({ table: replaceTable });

  /* swap table states */
  await TablesModel.updateOne(
    { title: currentTable },
    {
      type: replace.type,
      clientsNumber: replace.clientsNumber
    }
  );

  await TablesModel.updateOne(
    { title: replaceTable },
    {
      type: current.type,
      clientsNumber: current.clientsNumber
    }
  );

  /* swap orders (if exist) */
  if (currentOrder) {
    currentOrder.table = replaceTable;
    await currentOrder.save();
  }

  if (replaceOrder) {
    replaceOrder.table = currentTable;
    await replaceOrder.save();
  }

  res.json({ status: 200 });
};

export const getTablesCount = async (req, res) => {
  const count = await TablesModel.countDocuments({ type: "order" });
  res.json({ count });
};

