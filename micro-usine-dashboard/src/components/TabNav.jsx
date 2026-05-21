function TabNav({ activeTab, onChange }) {
  const tabs = [
    { id: 'global', label: 'Global' },
    { id: 'systems', label: 'Systemes' },
    { id: 'api', label: 'API Statistiques' },
    { id: 'bras', label: 'Bras' },
  ]

  return (
    <div style={styles.container}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          style={{
            ...styles.btn,
            ...(activeTab === tab.id ? styles.active : {})
          }}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    borderBottom: '1px solid #333',
    paddingBottom: '12px',
  },
  btn: {
    padding: '8px 20px',
    borderRadius: '6px',
    border: '1px solid #333',
    backgroundColor: 'transparent',
    color: '#888',
    cursor: 'pointer',
    fontSize: '14px',
  },
  active: {
    backgroundColor: '#e94560',
    border: '1px solid #e94560',
    color: '#fff',
  }
}

export default TabNav