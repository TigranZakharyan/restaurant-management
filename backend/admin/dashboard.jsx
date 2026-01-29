import React, { useEffect, useState, useRef } from 'react'
import { Box, H1, Text, Badge, Icon } from '@adminjs/design-system'
import Chart from 'chart.js/auto'
import axios from 'axios'

// Enhanced KPI Card with Hover Effects and Glassmorphism feel
const StatCard = ({ title, value, color, subtitle }) => (
  <Box
    p="xl"
    borderRadius="16px"
    style={{
      background: color,
      color: '#fff',
      boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <Text fontSize="sm" fontWeight="medium" style={{ opacity: 0.9 }}>{title}</Text>
    <Text fontSize="28px" fontWeight="bold" mt="xs">{value}</Text>
    {subtitle && <Text fontSize="xs" mt="sm" style={{ opacity: 0.8 }}>{subtitle}</Text>}
  </Box>
)

const Dashboard = () => {
  const [data, setData] = useState(null)
  const chartRefs = {
    orders: useRef(null),
    type: useRef(null),
    status: useRef(null),
  }
  const chartInstances = useRef({})

  useEffect(() => {
    axios.get('/admin/stats').then(res => setData(res.data))
    
    // Cleanup charts on unmount
    return () => {
      Object.values(chartInstances.current).forEach(chart => chart.destroy())
    }
  }, [])

  useEffect(() => {
    if (!data) return

    // Helper to destroy existing chart before re-render
    const initChart = (id, config) => {
      if (chartInstances.current[id]) chartInstances.current[id].destroy()
      chartInstances.current[id] = new Chart(chartRefs[id].current, config)
    }

    // Main Line Chart
    initChart('orders', {
      type: 'line',
      data: {
        labels: data.ordersByDay.map(d => d._id),
        datasets: [
          {
            label: 'Revenue',
            data: data.ordersByDay.map(d => d.totalRevenue),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Orders',
            data: data.ordersByDay.map(d => d.count),
            borderColor: '#6366f1',
            backgroundColor: 'transparent',
            tension: 0.4,
            borderDash: [5, 5],
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'bottom' } },
        scales: { y: { grid: { display: false } }, x: { grid: { display: false } } }
      },
    })

    // Distribution Charts
    const commonPieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } }
    }

    initChart('type', {
      type: 'doughnut',
      data: {
        labels: data.ordersByType.map(o => o._id.toUpperCase()),
        datasets: [{
          data: data.ordersByType.map(o => o.count),
          backgroundColor: ['#6366f1', '#f59e0b', '#ec4899'],
          cutout: '70%'
        }]
      },
      options: commonPieOptions
    })

    initChart('status', {
      type: 'doughnut',
      data: {
        labels: data.ordersByStatus.map(o => o._id.toUpperCase()),
        datasets: [{
          data: data.ordersByStatus.map(o => o.count),
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6366f1'],
          cutout: '70%'
        }]
      },
      options: commonPieOptions
    })
  }, [data])

  if (!data) return <Box p="xl"><Text>Loading Analytics...</Text></Box>

  return (
    <Box p="xl" bg="#f8fafc">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="xl">
        <Box>
          <H1 fontWeight="bold">Management Dashboard</H1>
          <Text color="gray.500">Real-time restaurant performance overview</Text>
        </Box>
        <Badge variant="info" p="md">Live Updates Active</Badge>
      </Box>

      {/* KPI Section */}
      <Box display="grid" gridTemplateColumns={['1fr', '1fr 1fr', 'repeat(4, 1fr)']} gap="lg" mb="xl">
        <StatCard title="Total Revenue" value={`${data.revenue.toLocaleString()} ֏`} color="linear-gradient(135deg, #059669 0%, #10b981 100%)" subtitle="Accumulated earnings" />
        <StatCard title="Total Orders" value={data.totalOrders} color="linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)" subtitle={`${data.totalUsers} Active Customers`} />
        <StatCard title="Inventory" value={data.totalProducts} color="linear-gradient(135deg, #d97706 0%, #f59e0b 100%)" subtitle="Unique menu items" />
        <StatCard title="Table Status" value={`${data.busyTables} / ${data.busyTables + data.freeTables}`} color="linear-gradient(135deg, #dc2626 0%, #ef4444 100%)" subtitle="Current occupancy" />
      </Box>

      {/* Main Analytics Row */}
      <Box display="grid" gridTemplateColumns={['1fr', '1fr', '2fr 1fr']} gap="lg" mb="xl">
        <Box bg="white" p="xl" borderRadius="16px" boxShadow="0 4px 6px -1px rgba(0,0,0,0.1)">
          <Text fontWeight="bold" mb="lg" fontSize="lg">Revenue Trends</Text>
          <Box height="300px">
            <canvas ref={chartRefs.orders} />
          </Box>
        </Box>
        
        <Box bg="white" p="xl" borderRadius="16px" boxShadow="0 4px 6px -1px rgba(0,0,0,0.1)">
          <Text fontWeight="bold" mb="lg" fontSize="lg">Order Status</Text>
          <Box height="300px">
            <canvas ref={chartRefs.status} />
          </Box>
        </Box>
      </Box>

      {/* Bottom Row: Rankings */}
      <Box display="grid" gridTemplateColumns={['1fr', '1fr 1fr']} gap="lg">
        {/* Top Products */}
        <Box bg="white" p="xl" borderRadius="16px" boxShadow="0 4px 6px -1px rgba(0,0,0,0.1)">
          <Text fontWeight="bold" mb="lg" fontSize="lg">Best Sellers</Text>
          {data.topProducts.map((p, i) => (
            <Box key={p._id} display="flex" alignItems="center" mb="md" pb="sm" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <Box 
                width="40px" height="40px" borderRadius="8px" mr="md"
                style={{ backgroundImage: `url(${p.product.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <Box flexGrow={1}>
                <Text fontWeight="medium">{p.product.title}</Text>
                <Text fontSize="xs" color="gray.500">{p.product.price} ֏ / unit</Text>
              </Box>
              <Badge variant="success">{p.quantity} sold</Badge>
            </Box>
          ))}
        </Box>

        {/* Top Customers */}
        <Box bg="white" p="xl" borderRadius="16px" boxShadow="0 4px 6px -1px rgba(0,0,0,0.1)">
          <Text fontWeight="bold" mb="lg" fontSize="lg">Valuable Customers</Text>
          {data.topUsers.map((u) => (
            <Box key={u._id} display="flex" alignItems="center" mb="md" pb="sm" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <Box width="40px" height="40px" borderRadius="20px" bg="gray.100" display="flex" alignItems="center" justifyContent="center" mr="md">
                <Text fontWeight="bold" color="indigo.500">{u.user.fullName.charAt(0)}</Text>
              </Box>
              <Box flexGrow={1}>
                <Text fontWeight="medium">{u.user.fullName}</Text>
                <Text fontSize="xs" color="gray.500">{u.ordersCount} Total Orders</Text>
              </Box>
              <Text fontWeight="bold" color="green.600">{u.revenue.toLocaleString()} ֏</Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard