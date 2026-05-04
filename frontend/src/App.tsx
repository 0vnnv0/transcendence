import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Feed from './pages/Feed'
import Projects from './pages/Projects'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
	  <Route path="/feed" element={<Feed />} />
	  <Route path="/projects" element={<Projects />} />
    </Routes>
  )
}

export default App