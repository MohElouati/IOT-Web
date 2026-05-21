import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import SankeyChart from '../components/SankeyChart'
import AdvancedSwipeChart from '../components/AdvancedSwipeChart'
import ReportModal from '../components/ReportModal'
import SessionStats from '../components/SessionStats'
import SessionPickerModal from '../components/SessionPickerModal'
import '../styles/dashboard.css'

const API = 'http://localhost:3000'

function Analytics() {
  const [top5, setTop5] = useState([])
  const [activeTab, setActiveTab] = useState('sessions')
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [swipeData, setSwipeData] = useState([])
  const [showReport, setShowReport] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [swipesBySession, setSwipesBySession] = useState({})

  const fetchTop5 = async () => {
    const res = await axios.get(`${API}/api-stats/top5`)
    setTop5(res.data)
  }

  const fetchSessions = async () => {
    const res = await axios.get(`${API}/sessions/stats`)
    const withSwipes = res.data.filter(s => s.total_swipes > 0)
    setSessions(withSwipes)
    if (withSwipes.length > 0 && !selectedSession) {
      setSelectedSession(withSwipes[0])
    }
    const swipesMap = {}
    await Promise.all(withSwipes.map(async s => {
      const r = await axios.get(`${API}/sessions/${s.id}/swipes`)
      swipesMap[s.id] = r.data
    }))
    setSwipesBySession(swipesMap)
  }

  const fetchSwipes = async (sessionId) => {
    const res = await axios.get(`${API}/sessions/${sessionId}/swipes`)
    setSwipeData(res.data)
  }

  const deleteSession = async (sessionId) => {
    if (!window.confirm('Supprimer cette session ?')) return
    await axios.delete(`${API}/sessions/${sessionId}`)
    const updated = sessions.filter(s => s.id !== sessionId)
    setSessions(updated)
    if (selectedSession?.id === sessionId) {
      setSelectedSession(updated.length > 0 ? updated[0] : null)
    }
  }

  useEffect(() => {
    fetchTop5()
    fetchSessions()
    const interval = setInterval(fetchTop5, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedSession) fetchSwipes(selectedSession.id)
  }, [selectedSession])

  const tabs = [
    { id: 'sessions', label: 'Sessions' },
    { id: 'swipe', label: 'Swipe' },
  ]

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main">
        <div className="topbar">
          <h1>Analytics</h1>
          <button style={styles.btnReport} onClick={() => setShowReport(true)}>
            Générer un rapport
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {top5.map((r, i) => (
            <div className="stat-card" key={r.route}>
              <div style={{ color: '#e94560', fontSize: '12px', marginBottom: '4px' }}>#{i + 1}</div>
              <div className="value" style={{ fontSize: '28px' }}>{r.count}</div>
              <div className="label">{r.route}</div>
            </div>
          ))}
        </div>

        <div style={styles.tabContainer}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              style={{ ...styles.tab, ...(activeTab === tab.id ? styles.tabActive : {}) }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'sessions' && (
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Analyse des catégories YouTube</h3>

            {sessions.length === 0 ? (
              <p style={{ color: '#888', fontSize: '14px' }}>Aucune session avec des swipes enregistrés.</p>
            ) : (
              <>
                <SessionStats sessions={sessions} />

                {/* Sélecteur de session propre */}
                <div style={styles.sessionSelector}>
                  <div style={styles.sessionInfo}>
                    {selectedSession ? (
                      <>
                        <span style={styles.sessionLabel}>Session #{selectedSession.id}</span>
                        <span style={styles.sessionMeta}>
                          {selectedSession.total_swipes} swipes — {selectedSession.started_at.substring(0, 10)}
                        </span>
                      </>
                    ) : (
                      <span style={styles.sessionMeta}>Aucune session sélectionnée</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={styles.btnPicker} onClick={() => setShowPicker(true)}>
                      Choisir une session
                    </button>
                    {selectedSession && (
                      <button style={styles.btnDelete} onClick={() => deleteSession(selectedSession.id)}>
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>

                {swipeData.length > 0 ? (
                  <SankeyChart
                    data={swipeData}
                    sessionName={`Session #${selectedSession?.id}`}
                    height={280}
                  />
                ) : (
                  <p style={{ color: '#888', fontSize: '14px' }}>Aucune donnée de catégorie pour cette session.</p>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'swipe' && (
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Comparaison Swipe Up vs Swipe Down</h3>
            <AdvancedSwipeChart />
          </div>
        )}
      </div>

      {showReport && (
        <ReportModal
          onClose={() => setShowReport(false)}
          sessions={sessions}
          swipeDataBySession={{ top5, swipes: swipesBySession }}
        />
      )}

      {showPicker && (
        <SessionPickerModal
          sessions={sessions}
          selectedSession={selectedSession}
          onSelect={setSelectedSession}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}

const styles = {
  btnReport: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #e94560',
    backgroundColor: 'transparent',
    color: '#e94560',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  tabContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    borderBottom: '1px solid #333',
    paddingBottom: '12px',
  },
  tab: {
    padding: '8px 20px',
    borderRadius: '6px',
    border: '1px solid #333',
    backgroundColor: 'transparent',
    color: '#888',
    cursor: 'pointer',
    fontSize: '14px',
  },
  tabActive: {
    backgroundColor: '#e94560',
    border: '1px solid #e94560',
    color: '#fff',
  },
  sessionSelector: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #333',
    marginBottom: '16px',
  },
  sessionInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  sessionLabel: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  sessionMeta: {
    color: '#888',
    fontSize: '12px',
  },
  btnPicker: {
    padding: '8px 14px',
    borderRadius: '6px',
    border: '1px solid #e94560',
    backgroundColor: 'transparent',
    color: '#e94560',
    cursor: 'pointer',
    fontSize: '13px',
  },
  btnDelete: {
    padding: '8px 14px',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: 'transparent',
    color: '#666',
    cursor: 'pointer',
    fontSize: '13px',
  },
}

export default Analytics