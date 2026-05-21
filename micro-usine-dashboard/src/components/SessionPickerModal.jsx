import { useState } from 'react'

function SessionPickerModal({ sessions, selectedSession, onSelect, onClose }) {
  const [checked, setChecked] = useState(selectedSession?.id || null)

  const handleValidate = () => {
    const session = sessions.find(s => s.id === checked)
    if (session) onSelect(session)
    onClose()
  }

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Choisir une session</h2>
          <button style={styles.btnClose} onClick={onClose}>✕</button>
        </div>

        <div style={styles.list}>
          {sessions.length === 0 ? (
            <p style={styles.empty}>Aucune session disponible.</p>
          ) : (
            sessions.map(s => (
              <label
                key={s.id}
                style={{
                  ...styles.item,
                  ...(checked === s.id ? styles.itemActive : {})
                }}
              >
                <input
                  type="radio"
                  name="session"
                  checked={checked === s.id}
                  onChange={() => setChecked(s.id)}
                  style={styles.radio}
                />
                <div style={styles.itemLeft}>
                  <span style={styles.itemId}>Session #{s.id}</span>
                  <span style={styles.itemDate}>
                    {s.started_at.substring(0, 10)} à {s.started_at.substring(11, 16)}
                  </span>
                </div>
                <div style={styles.itemRight}>
                  <span style={styles.itemSwipes}>{s.total_swipes} swipes</span>
                  <span style={styles.itemDuration}>
                    {s.ended_at ? `${Math.round((new Date(s.ended_at) - new Date(s.started_at)) / 1000)}s` : 'En cours'}
                  </span>
                </div>
              </label>
            ))
          )}
        </div>

        <div style={styles.footer}>
          <button style={styles.btnCancel} onClick={onClose}>Annuler</button>
          <button
            style={{ ...styles.btnValidate, opacity: checked ? 1 : 0.4 }}
            onClick={handleValidate}
            disabled={!checked}
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#16213e',
    borderRadius: '12px',
    width: '560px',
    maxHeight: '70vh',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #333',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #333',
  },
  title: {
    color: '#fff',
    margin: 0,
    fontSize: '18px',
  },
  btnClose: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '18px',
    cursor: 'pointer',
  },
  list: {
    overflowY: 'auto',
    flex: 1,
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  empty: {
    color: '#888',
    fontSize: '14px',
    textAlign: 'center',
    padding: '24px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: '8px',
    border: '1px solid #333',
    cursor: 'pointer',
    backgroundColor: 'transparent',
  },
  itemActive: {
    border: '1px solid #e94560',
    backgroundColor: 'rgba(233, 69, 96, 0.05)',
  },
  radio: {
    accentColor: '#e94560',
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  itemLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  itemId: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  itemDate: {
    color: '#888',
    fontSize: '12px',
  },
  itemRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
  },
  itemSwipes: {
    color: '#e94560',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  itemDuration: {
    color: '#888',
    fontSize: '12px',
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid #333',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  btnCancel: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #333',
    backgroundColor: 'transparent',
    color: '#888',
    cursor: 'pointer',
    fontSize: '14px',
  },
  btnValidate: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#e94560',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
}

export default SessionPickerModal