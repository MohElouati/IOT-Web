import { useState, useRef } from 'react'
import SankeyChart from './SankeyChart'
import AdvancedSwipeChart from './AdvancedSwipeChart'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

function ReportModal({ onClose, sessions, swipeDataBySession }) {
  const [includeTop5, setIncludeTop5] = useState(true)
  const [includeSankey, setIncludeSankey] = useState(true)
  const [includeSwipeChart, setIncludeSwipeChart] = useState(true)
  const [selectedSessions, setSelectedSessions] = useState(
    sessions.length > 0 ? [sessions[0].id] : []
  )
  const [generating, setGenerating] = useState(false)
  const reportRef = useRef()

  const toggleSession = (id) => {
    setSelectedSessions(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const generatePDF = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 500))

    const canvas = await html2canvas(reportRef.current, {
      backgroundColor: '#1a1a2e',
      scale: 2,
      useCORS: true,
      scrollY: 0,
      height: reportRef.current.scrollHeight,
      windowHeight: reportRef.current.scrollHeight
    })

    const imgData = canvas.toDataURL('image/png')
    const pdfWidth = 210
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pdfWidth, pdfHeight]
    })

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`rapport-micro-usine-${new Date().toISOString().substring(0, 10)}.pdf`)
    setGenerating(false)
  }

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>

        <div style={styles.header}>
          <h2 style={styles.title}>Générer un rapport</h2>
          <button style={styles.btnClose} onClick={onClose}>✕</button>
        </div>

        <div style={styles.options}>
          <p style={styles.optionsTitle}>Contenu du rapport</p>

          <label style={styles.checkbox}>
            <input type="checkbox" checked={includeTop5} onChange={e => setIncludeTop5(e.target.checked)} />
            <span>Top 5 des routes API les plus utilisées</span>
          </label>

          <label style={styles.checkbox}>
            <input type="checkbox" checked={includeSankey} onChange={e => setIncludeSankey(e.target.checked)} />
            <span>Diagramme Sankey — Analyse des catégories YouTube</span>
          </label>

          {includeSankey && sessions.length > 0 && (
            <div style={styles.sessionPicker}>
              <p style={styles.sessionPickerLabel}>Sessions à inclure :</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {sessions.map(s => (
                  <label key={s.id} style={{
                    ...styles.sessionTag,
                    ...(selectedSessions.includes(s.id) ? styles.sessionTagActive : {})
                  }}>
                    <input
                      type="checkbox"
                      checked={selectedSessions.includes(s.id)}
                      onChange={() => toggleSession(s.id)}
                      style={{ display: 'none' }}
                    />
                    Session #{s.id} — {s.total_swipes} swipes
                  </label>
                ))}
              </div>
            </div>
          )}

          <label style={styles.checkbox}>
            <input type="checkbox" checked={includeSwipeChart} onChange={e => setIncludeSwipeChart(e.target.checked)} />
            <span>Graphique Swipe Up vs Swipe Down</span>
          </label>
        </div>

        <div style={styles.preview}>
          <p style={styles.optionsTitle}>Aperçu</p>
          <div ref={reportRef} style={styles.reportContent}>
            <div style={styles.reportHeader}>
              <h1 style={styles.reportTitle}>Micro-Usine Tactile — Rapport d'analyse</h1>
              <p style={styles.reportDate}>Généré le {new Date().toLocaleDateString('fr-FR')}</p>
            </div>

            {includeTop5 && swipeDataBySession?.top5 && (
              <div style={styles.reportSection}>
                <h3 style={styles.sectionTitle}>Top 5 des routes API</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {swipeDataBySession.top5.map((r, i) => (
                    <div key={r.route} style={styles.reportRow}>
                      <span style={styles.reportRank}>#{i + 1}</span>
                      <span style={styles.reportRoute}>{r.route}</span>
                      <span style={styles.reportCount}>{r.count} appels</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {includeSankey && selectedSessions.map(sessionId => {
              const session = sessions.find(s => s.id === sessionId)
              const data = swipeDataBySession?.swipes?.[sessionId] || []
              if (!data.length) return null
              return (
                <div key={sessionId} style={styles.reportSection}>
                  <h3 style={styles.sectionTitle}>
                    Sankey — Session #{sessionId} ({session?.total_swipes} swipes — {session?.started_at?.substring(0, 10)})
                  </h3>
                  <SankeyChart data={data} sessionName={`Session #${sessionId}`} />
                </div>
              )
            })}

            {includeSwipeChart && (
              <div style={styles.reportSection}>
                <h3 style={styles.sectionTitle}>Comparaison Swipe Up vs Swipe Down</h3>
                <AdvancedSwipeChart />
              </div>
            )}
          </div>
        </div>

        <div style={styles.footer}>
          <button style={styles.btnCancel} onClick={onClose}>Annuler</button>
          <button style={styles.btnGenerate} onClick={generatePDF} disabled={generating}>
            {generating ? 'Génération...' : 'Télécharger PDF'}
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
    width: '800px',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #333',
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
  options: {
    padding: '20px 24px',
    borderBottom: '1px solid #333',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  optionsTitle: {
    color: '#888',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    margin: 0,
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
  },
  sessionPicker: {
    marginLeft: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sessionPickerLabel: {
    color: '#888',
    fontSize: '12px',
    margin: 0,
  },
  sessionTag: {
    padding: '4px 10px',
    borderRadius: '6px',
    border: '1px solid #333',
    color: '#888',
    fontSize: '12px',
    cursor: 'pointer',
  },
  sessionTagActive: {
    border: '1px solid #e94560',
    color: '#e94560',
  },
  preview: {
    padding: '20px 24px',
    overflowY: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  reportContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: '8px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  reportHeader: {
    borderBottom: '1px solid #333',
    paddingBottom: '16px',
  },
  reportTitle: {
    color: '#fff',
    margin: '0 0 4px 0',
    fontSize: '20px',
  },
  reportDate: {
    color: '#888',
    margin: 0,
    fontSize: '13px',
  },
  reportSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    color: '#e94560',
    margin: 0,
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  reportRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    backgroundColor: '#0f3460',
    borderRadius: '6px',
  },
  reportRank: {
    color: '#e94560',
    fontSize: '12px',
    minWidth: '24px',
  },
  reportRoute: {
    color: '#fff',
    fontSize: '13px',
    flex: 1,
  },
  reportCount: {
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
  btnGenerate: {
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

export default ReportModal