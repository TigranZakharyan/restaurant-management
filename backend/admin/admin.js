import AdminJS from 'adminjs'

import { CategoriesModel } from '../models/categories.js'
import { ProductsModel } from '../models/productsModel.js'
import { OrdersModel } from '../models/ordersModel.js'
import { TablesModel } from '../models/tablesModel.js'
import { UsersModel } from '../models/usersModel.js'

import * as AdminJSMongoose from '@adminjs/mongoose'
import componentLoader, { Components } from './component-loader.js'

AdminJS.registerAdapter(AdminJSMongoose)

const adminJs = new AdminJS({
  rootPath: '/admin',

  componentLoader,

  branding: {
    companyName: 'Restaurant Admin',
    logo: false,
    theme: {
      colors: {
        primary100: '#1e293b',
        accent: '#22c55e',
      },
    },
  },

  dashboard: {
    component: Components.Dashboard,
  },

  resources: [
    {
      resource: UsersModel,
      options: {
        navigation: 'User Management',
        properties: {
          password: {
            isVisible: { list: false, edit: true, show: false },
          },
        },
      },
    },

    {
      resource: CategoriesModel,
      options: {
        navigation: 'Menu',
      },
    },

    {
      resource: ProductsModel,
      options: {
        navigation: 'Menu',
        properties: {
          categoryId: { reference: 'categories' },
        },
      },
    },

    {
      resource: OrdersModel,
      options: {
        navigation: 'Orders',
        properties: {
          tableId: { reference: 'tables' },
          userId: { reference: 'users' },
          'items.productId': { reference: 'products' },
        },
      },
    },

    {
      resource: TablesModel,
      options: {
        navigation: 'Restaurant',
        properties: {
          orderId: { reference: 'orders' },
        },
      },
    },
  ],
})

export default adminJs
