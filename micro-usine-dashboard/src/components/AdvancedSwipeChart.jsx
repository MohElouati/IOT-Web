import { useState, useEffect } from 'react'
import api from '../api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

function AdvancedSwipeChart() {
  const [data, setData] = useState([])

  const fetchData = async () => {
    const res = await api.get(`/logs`)
    const logs = res.data

    const grouped = logs.reduce((acc, log) => {
      const hour = log.timestamp.substring(11, 16)
      if (!acc[hour]) acc[hour] = { time: hour, up: 0, down: 0 }
      if (log.action === 'swipe_up' || log.action === 'scroll_up') acc[hour].up += 1
      if (log.action === 'swipe_down' || log.action === 'scroll_down') acc[hour].down += 1
      return acc
    }, {})

    setData(Object.values(grouped).reverse())
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 11 }} />
        <YAxis stroke="#888" />
        <Tooltip contentStyle={{ backgroundColor: '#222', border: 'none' }} />
        <Legend />
        <Line type="monotone" dataKey="up" stroke="#2ecc71" strokeWidth={2} dot={false} name="Swipe Up" />
        <Line type="monotone" dataKey="down" stroke="#e94560" strokeWidth={2} dot={false} name="Swipe Down" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default AdvancedSwipeChart