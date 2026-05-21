function StatusTable({ broker, esp32 }) {
  const components = [
    {
      name: 'Broker MQTT',
      status: broker ? 'Reachable' : 'Unreachable',
      ok: broker
    },
    {
      name: 'Backend API',
      status: 'Online',
      ok: true
    },
    {
      name: 'ESP32',
      status: esp32 ? 'Connected' : 'Disconnected',
      ok: esp32
    },
  ]

  return (
    <div className="card">
      <h3>Etat des composants</h3>
      <table>
        <thead>
          <tr>
            <th>Composant</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {components.map(c => (
            <tr key={c.name}>
              <td>{c.name}</td>
              <td>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: c.ok ? '#2ecc71' : '#e94560',
                    display: 'inline-block'
                  }} />
                  {c.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StatusTable