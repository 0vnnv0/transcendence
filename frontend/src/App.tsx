import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import MyProfile from './pages/MyProfile'
import Chats from './pages/Chats'
import Certain_Project from './pages/Certain_Project'
import Authorize from './pages/Authorize'
import AuthSuccess from './pages/AuthSuccess'
import OtherProfile from './pages/OtherProfile'
import Friends from './pages/Friends'
import SearchResultsPage from './pages/SearchResultsPage'
import { ProtectedRoute, PublicRoute, AuthorizeRoute } from './components/context/AuthRoutes'
import { Toaster } from 'react-hot-toast'
import NotFound from './pages/NotFound'
import TermsOfService from './pages/LegalPages/TermsOfService'
import PrivacyPolicy from './pages/LegalPages/PrivacyPolicy'

export function App() {
  return (
    <>
      <Toaster position="top-center" />

      <Routes>
		<Route element={<PublicRoute />}>
           <Route path="/" element={<Login />} />
        </Route>

		<Route element={<AuthorizeRoute />}>
            <Route path="/authorize" element={<Authorize />} />
        </Route>

		<Route path="/authsuccess" element={<AuthSuccess />} />
		<Route element={<ProtectedRoute />}>
		    {/* <Route path="/authorize" element={<Authorize />} /> */}
			<Route path="/" element={<Login />} />
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/projects" element={<Projects />} />
			<Route path="/myprofile" element={<MyProfile />} />
			<Route path="/chats" element={<Chats />} />
			<Route path="/project/:id" element={<Certain_Project />} />
			<Route path="/chat/:chatId" element={<Chats />} />
			<Route path="/friends" element={<Friends />} />
			<Route path="/users/:username" element={<OtherProfile />} />
			<Route path="/search" element={<SearchResultsPage />} />
			<Route path="/terms-and-conditions" element={<TermsOfService />} />
			<Route path="/privacy-policy" element={<PrivacyPolicy />} />
			<Route path="*" element={<NotFound />} />
		</Route>
      </Routes>
    </>
  );
}

export default App
