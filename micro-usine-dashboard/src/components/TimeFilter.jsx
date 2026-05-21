import { useState } from 'react'

function TimeFilter({ onChange }) {
  const [selected, setSelected] = useState('24h')

  const select = (value) => {
    setSelected(value)
    onChange(value)
  }

  return (
    <div style={styles.container}>
      <button style={{ ...styles.btn, ...(selected === '24h' ? styles.active : {}) }} onClick={() => select('24h')}>
        24 heures
      </button>
      <button style={{ ...styles.btn, ...(selected === '7d' ? styles.active : {}) }} onClick={() => select('7d')}>
        7 jours
      </button>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    gap: '8px',
  },
  btn: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #e94560',
    backgroundColor: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
  },
  active: {
    backgroundColor: '#e94560',
  }
}

export default TimeFilter