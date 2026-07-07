import axios from 'axios'

const API = import.meta.env.VITE_API_URL

function SwipeButtons({ onAction }) {
  const scroll = async (direction) => {
    await axios.post(`${API}/scroll/${direction}`)
    await axios.post(`${API}/sessions/swipe`, { direction })
    if (onAction) onAction(direction)
  }

  return (
    <div style={styles.container}>
      <button style={styles.btnUp} onClick={() => scroll('up')}>
        <div style={styles.arrow}>↑</div>
        <span style={styles.label}>Swipe Up</span>
      </button>
      <button style={styles.btnDown} onClick={() => scroll('down')}>
        <span style={styles.label}>Swipe Down</span>
        <div style={styles.arrow}>↓</div>
      </button>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  btnUp: {
    width: '180px',
    height: '180px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#2ecc71',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  btnDown: {
    width: '180px',
    height: '180px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#e94560',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  arrow: {
    fontSize: '48px',
    lineHeight: 1,
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
  }
}

export default SwipeButtons