import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Feed from './pages/Feed'
import Projects from './pages/Projects'
import MyProfile from './pages/MyProfile'
import Chats from './pages/Chats'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
	  <Route path="/feed" element={<Feed />} />
	  <Route path="/projects" element={<Projects />} />
	  <Route path="/myprofile" element={<MyProfile />} />
	  <Route path="/chats" element={<Chats />} />
    </Routes>
  )
}

export default App