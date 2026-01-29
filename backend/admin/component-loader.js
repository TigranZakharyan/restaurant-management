import { ComponentLoader } from 'adminjs'

const componentLoader = new ComponentLoader()

// Register dashboard
export const Components = {
  Dashboard: componentLoader.add('Dashboard', './dashboard.jsx'),
}

export default componentLoader
