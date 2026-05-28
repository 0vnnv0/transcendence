import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Feed from './pages/Feed'
import Projects from './pages/Projects'
import MyProfile from './pages/MyProfile'
import Chats from './pages/Chats'
import Certain_Project from './pages/Certain_Project'
import Authorize from './pages/Authorize'
import AuthSuccess from './pages/AuthSuccess'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
	  <Route path="/feed" element={<Feed />} />
	  <Route path="/projects" element={<Projects />} />
	  <Route path="/myprofile" element={<MyProfile />} />
	  <Route path="/chats" element={<Chats />} />
	  <Route path="/project/:id" element={<Certain_Project />} />
	  <Route path="/chat/:username" element={<Chats />} />
	  <Route path="/authorize" element={<Authorize />} />
	  <Route path="/authsuccess" element={<AuthSuccess />} />
    </Routes>
  )
}

export default App
