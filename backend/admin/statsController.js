import { OrdersModel } from '../models/ordersModel.js'
import { TablesModel } from '../models/tablesModel.js'
import { ProductsModel } from '../models/productsModel.js'
import { UsersModel } from '../models/usersModel.js'
import mongoose from 'mongoose'

export const getAdminStats = async (req, res) => {
  // Total counts
  const totalOrders = await OrdersModel.countDocuments()
  const totalProducts = await ProductsModel.countDocuments()
  const totalUsers = await UsersModel.countDocuments()
  const busyTables = await TablesModel.countDocuments({ status: 'busy' })
  const freeTables = await TablesModel.countDocuments({ status: 'free' })
  const reservedTables = await TablesModel.countDocuments({ status: 'reserved' })

  // Revenue
  const revenueAgg = await OrdersModel.aggregate([
    { $group: { _id: null, total: { $sum: '$total' } } },
  ])
  const revenue = revenueAgg[0]?.total || 0

  // Orders by day (last 7 days)
  const ordersByDay = await OrdersModel.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 7 },
  ])

  // Orders by type
  const ordersByTypeAgg = await OrdersModel.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
      },
    },
  ])

  // Orders by status
  const ordersByStatusAgg = await OrdersModel.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ])

  // Top products
  const topProducts = await OrdersModel.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        quantity: { $sum: '$items.quantity' },
      },
    },
    { $sort: { quantity: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
  ])

  // Most active users (top 5 by number of orders)
  const topUsers = await OrdersModel.aggregate([
    {
      $group: {
        _id: '$userId',
        ordersCount: { $sum: 1 },
        revenue: { $sum: '$total' },
      },
    },
    { $sort: { ordersCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
  ])

  res.json({
    totalOrders,
    totalProducts,
    totalUsers,
    busyTables,
    freeTables,
    reservedTables,
    revenue,
    ordersByDay,
    ordersByType: ordersByTypeAgg,
    ordersByStatus: ordersByStatusAgg,
    topProducts,
    topUsers,
  })
}
