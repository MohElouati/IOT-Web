import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Supervision from './pages/Supervision'
import Control from './pages/Control'
import Systemes from './pages/Systemes'
import Logs from './pages/Logs'
import Analytics from './pages/Analytics'

const IDLE_TIMEOUT_MS = 15 * 60 * 1000
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) return

    let timer
    const logout = () => {
      localStorage.removeItem('token')
      navigate('/login')
    }
    const resetTimer = () => {
      clearTimeout(timer)
      timer = setTimeout(logout, IDLE_TIMEOUT_MS)
    }

    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, resetTimer))
    resetTimer()

    return () => {
      clearTimeout(timer)
      ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, resetTimer))
    }
  }, [token, navigate])

  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/supervision" element={<PrivateRoute><Supervision /></PrivateRoute>} />
        <Route path="/control" element={<PrivateRoute><Control /></PrivateRoute>} />
        <Route path="/logs" element={<PrivateRoute><Logs /></PrivateRoute>} />
        <Route path="/systemes" element={<PrivateRoute><Systemes /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/supervision" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App