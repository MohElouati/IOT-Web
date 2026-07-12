import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (data.token) {
        localStorage.setItem('token', data.token)
        navigate('/supervision')
      } else if (res.status === 429) {
        const minutes = Math.ceil(data.retryAfterSec / 60)
        setError(`Trop de tentatives, réessayez dans ${minutes} min`)
      } else {
        setError('Identifiants incorrects')
      }
    } catch {
      setError('Erreur serveur')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>MCU</h1>
        <p style={styles.subtitle}>Interface de supervision</p>
        <input
          style={styles.input}
          placeholder="Utilisateur"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.button} onClick={handleLogin}>
          Connexion
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#1a1a2e',
  },
  card: {
    backgroundColor: '#16213e',
    padding: '40px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '320px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    margin: 0,
  },
  subtitle: {
    color: '#888',
    textAlign: 'center',
    margin: 0,
    fontSize: '14px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #333',
    backgroundColor: '#0f3460',
    color: '#fff',
    fontSize: '16px',
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#e94560',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },
  error: {
    color: '#e94560',
    textAlign: 'center',
    margin: 0,
  }
}

export default Login