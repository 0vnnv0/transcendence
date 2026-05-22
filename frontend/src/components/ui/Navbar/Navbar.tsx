import { useNavigate } from 'react-router-dom'
import SearchBar from '../Search/Search'
import NavItem from '../NavItem/NavItem'
import ChatMenu from '../ChatMenu/ChatMenu'

function Navbar() {
  const navigate = useNavigate()

  return (
	<nav className="fixed left-0 top-0 h-screen w-70 flex flex-col flex-1 min-h-screen items-start gap-4 p-6 bg-black">
		<div className="top-6 w-full">
			<SearchBar />
		</div>
		<ul className="flex flex-col mt-50 gap-2 w-full">
			<NavItem label="Dashboard" iconPath="/home.svg" route="/dashboard" />
			<NavItem label="Feed" iconPath="/feed.svg" route="/feed" />
			<NavItem label="Projects" iconPath="/projects.svg" route="/projects" />		
		</ul>
		<ChatMenu />
		<div className="bottom-6 mt-auto">
			<div className="relative inline-block">
			<img
				src="/profile.jpg"
				className="w-12 h-12 rounded-md object-cover transition-all hover:scale-110 cursor-pointer"
				onClick={() => navigate ('/myprofile')}
			/>
			<span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-black rounded-full"></span>
		</div>
		</div>
    </nav>
  )
}

export default Navbar
