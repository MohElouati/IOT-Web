function StatCard({ value, label, trend }) {
  return (
    <div className="stat-card">
      <div className="value">
        {value} {trend === 'up' && <span className="trend-up">▲</span>}
        {trend === 'down' && <span className="trend-down">▼</span>}
      </div>
      <div className="label">{label}</div>
    </div>
  )
}

export default StatCard