const PLAYLIST_SIZE = 6

function SessionStats({ sessions }) {
  const totalSessions = sessions.length

  const avgDuration = () => {
    const withDuration = sessions.filter(s => s.started_at && s.ended_at)
    if (!withDuration.length) return '--'
    const avg = withDuration.reduce((acc, s) => {
      const diff = (new Date(s.ended_at) - new Date(s.started_at)) / 1000
      return acc + diff
    }, 0) / withDuration.length
    const m = Math.floor(avg / 60)
    const s = Math.floor(avg % 60)
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  const avgCompletion = () => {
    const withSwipes = sessions.filter(s => s.total_swipes > 0)
    if (!withSwipes.length) return '--'
    const avg = withSwipes.reduce((acc, s) => acc + (s.total_swipes / PLAYLIST_SIZE) * 100, 0) / withSwipes.length
    return `${Math.min(Math.round(avg), 100)}%`
  }

  const stats = [
    { label: 'Sessions enregistrées', value: totalSessions },
    { label: 'Durée moyenne', value: avgDuration() },
    { label: 'Complétion playlist', value: avgCompletion() },
  ]

  return (
    <div style={styles.grid}>
      {stats.map(s => (
        <div key={s.label} style={styles.card}>
          <div style={styles.value}>{s.value}</div>
          <div style={styles.label}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '16px',
  },
  card: {
    backgroundColor: '#0f3460',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  value: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  label: {
    color: '#888',
    fontSize: '12px',
  }
}

export default SessionStats