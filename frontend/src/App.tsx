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
import OtherProfile from './pages/OtherProfile'
 import { ProtectedRoute, PublicRoute } from './components/context/AuthRoutes'


// function App() {
//   return (
//     <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/authorize" element={<Authorize />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/feed" element={<Feed />} />
//         <Route path="/projects" element={<Projects />} />
//         <Route path="/myprofile" element={<MyProfile />} />
//         <Route path="/chats" element={<Chats />} />
//         <Route path="/project/:id" element={<Certain_Project />} />
//         <Route path="/chat/:username" element={<Chats />} />
// 		 <Route path="/:username" element={<OtherProfile />} />  

// 	  <Route path="/authsuccess" element={<AuthSuccess />} />
//     </Routes>
//   )
// }


function App() {
  return (
    <Routes>
		<Route element={<PublicRoute />}>
        <Route path="/" element={<Login />} />
        <Route path="/authorize" element={<Authorize />} />
      </Route>      
	  <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/project/:id" element={<Certain_Project />} />
        <Route path="/chat/:username" element={<Chats />} />
		 <Route path="/:username" element={<OtherProfile />} />
      </Route>
	  

	  <Route path="/authsuccess" element={<AuthSuccess />} />
    </Routes>
  )
}

export default App
