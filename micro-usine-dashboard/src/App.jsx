import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Supervision from './pages/Supervision'
import Control from './pages/Control'
import Systemes from './pages/Systemes'
import Logs from './pages/Logs'
import Analytics from './pages/Analytics'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
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