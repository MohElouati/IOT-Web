import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import SwipeButtons from '../components/SwipeButtons'
import '../styles/dashboard.css'

const API = import.meta.env.VITE_API_URL

const PLATFORMS = [
  { id: 'youtube', label: 'YouTube', beta: true },
]

function Control() {
  const [lastAction, setLastAction] = useState(null)
  const [session, setSession] = useState(null)
  const [ytConnected, setYtConnected] = useState(false)

  const fetchActiveSession = async () => {
    const res = await axios.get(`${API}/sessions/active`)
    if (res.data.id) setSession(res.data)
    else setSession(null)
  }

  const checkYoutubeAuth = async () => {
    try {
      const res = await axios.get(`${API}/youtube/playlist`)
      if (res.data.length > 0) setYtConnected(true)
    } catch {
      setYtConnected(false)
    }
  }

  useEffect(() => {
    fetchActiveSession()
    checkYoutubeAuth()
  }, [])

  const connectYoutube = () => {
    window.open(`${API}/auth/login`, '_blank')
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API}/youtube/playlist`)
        if (res.data.length > 0) {
          setYtConnected(true)
          clearInterval(interval)
        }
      } catch {}
    }, 2000)
    setTimeout(() => clearInterval(interval), 30000)
  }

  const startSession = async (platform) => {
    const res = await axios.post(`${API}/sessions/start`, { platform })
    setSession(res.data)
  }

  const stopSession = async () => {
    await axios.post(`${API}/sessions/stop`)
    setSession(null)
    setLastAction(null)
  }

  const handleSwipe = async (direction) => {
    setLastAction(direction)
    if (session) {
      await axios.post(`${API}/sessions/swipe`, { direction })
    }
  }

  const emergencyStop = async () => {
    if (!window.confirm('Confirmer l\'arrêt d\'urgence ?')) return
    await axios.post(`${API}/scroll/emergency-stop`)
    setLastAction('emergency_stop')
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main">
        <div className="topbar">
          <h1>Control</h1>
        </div>

        <div style={{ display: 'flex', gap: '24px', marginTop: '24px', alignItems: 'flex-start' }}>

          {/* Bloc télécommande */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ display: 'inline-flex', padding: '30px', width: 'fit-content' }}>
              <SwipeButtons onAction={handleSwipe} />
            </div>
            {lastAction && (
              <p style={{ color: '#888', textAlign: 'center', fontSize: '14px' }}>
                Derniere action : {lastAction === 'up' ? 'Swipe Up' : lastAction === 'emergency_stop' ? '⚠ Arrêt d\'urgence' : 'Swipe Down'}
              </p>
            )}
          </div>

          {/* Bloc session */}
          <div className="card" style={{ minWidth: '300px' }}>
            <h3>Session</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0' }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%',
                backgroundColor: ytConnected ? '#2ecc71' : '#e94560',
                display: 'inline-block'
              }} />
              <span style={{ color: '#888', fontSize: '13px' }}>
                YouTube {ytConnected ? 'connecté' : 'non connecté'}
              </span>
              {!ytConnected && (
                <button style={styles.btnConnect} onClick={connectYoutube}>
                  Connecter
                </button>
              )}
            </div>

            {!session ? (
              <>
                <p style={{ color: '#888', fontSize: '14px', margin: '12px 0' }}>
                  Choisissez une plateforme pour enregistrer vos swipes
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                  {PLATFORMS.map(p => (
                    <button
                      key={p.id}
                      style={{
                        ...styles.platformBtn,
                        opacity: p.id === 'youtube' && !ytConnected ? 0.4 : 1,
                        cursor: p.id === 'youtube' && !ytConnected ? 'not-allowed' : 'pointer'
                      }}
                      onClick={() => {
                        if (p.id === 'youtube' && !ytConnected) return
                        startSession(p.id)
                      }}
                    >
                      {p.label} <span style={styles.beta}>Beta</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ marginTop: '12px' }}>
                <p style={{ color: '#2ecc71', fontSize: '14px' }}>Session active — {session.platform}</p>
                <button style={{ ...styles.btnStop, marginTop: '16px', width: '100%' }} onClick={stopSession}>
                  Arrêter la session
                </button>
              </div>
            )}
          </div>

          <button style={styles.btnEmergency} onClick={emergencyStop}>
            ⚠ ARRÊT D'URGENCE
          </button>

        </div>
      </div>
    </div>
  )
}

const styles = {
  btnStop: {
    padding: '10px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#e94560',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
  },
  btnConnect: {
    padding: '4px 10px',
    borderRadius: '4px',
    border: '1px solid #e94560',
    backgroundColor: 'transparent',
    color: '#e94560',
    cursor: 'pointer',
    fontSize: '12px',
  },
  platformBtn: {
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid #333',
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: '15px',
    textAlign: 'left',
  },
  beta: {
    fontSize: '10px',
    backgroundColor: '#333',
    padding: '2px 6px',
    borderRadius: '4px',
    marginLeft: '8px',
    color: '#888',
  },
  btnEmergency: {
    padding: '14px',
    borderRadius: '8px',
    border: '2px solid #ff0000',
    backgroundColor: '#ff0000',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
    width: '100%',
    letterSpacing: '1px',
  }
}

export default Control