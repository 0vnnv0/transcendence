import { useNavigate } from 'react-router-dom'
import SearchBar from '../Search/Search'
import NavItem from '../NavItem/NavItem'

function Navbar() {
  const navigate = useNavigate()

  return (
	<nav className="fixed left-0 top-0 h-screen w-70 flex flex-col flex-1 min-h-screen items-start gap-4 p-6 bg-black">
		<div className="top-6 w-full">
			<SearchBar />
		</div>
		<ul className="flex flex-col my-auto gap-2 w-full">
			<NavItem label="Dashboard" iconPath="/home.svg" route="/dashboard" />
			<NavItem label="Feed" iconPath="feed.svg" route="/feed" />
			<NavItem label="Projects" iconPath="projects.svg" route="/projects" />		
		</ul>
		<div className="bottom-6 mt-auto">
			<img
				src="/profile.jpg"
				className="w-12 h-12 rounded-2xl object-cover transition-all hover:scale-110 cursor-pointer"
				onClick={() => navigate ('/myprofile')}
			/>
		</div>
    </nav>
  )
}

export default Navbar
