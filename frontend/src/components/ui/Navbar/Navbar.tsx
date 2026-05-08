import { useNavigate } from 'react-router-dom'
import SearchBar from '../Search/Search'

function Navbar() {
  const navigate = useNavigate()
  const navButton = "flex items-center gap-2 text-orange-500 hover:text-yellow-500 transition-all hover:scale-110 cursor-pointer"

  return (
	<nav className="fixed left-0 top-0 h-screen w-48 flex flex-col items-start justify-center gap-4 p-6 bg-blue-400/20 backdrop-blur-md border-r border-orange-500/50">
		<div className="top-6">
			<SearchBar />
		</div>
		<ul className="flex flex-col gap-2 mt-auto mb-auto">
     	   <li><button className={navButton} onClick={() => navigate('/dashboard')}>
				<img src="/home.svg"/>Dashboard<img src="/arrow.svg" />
			</button></li>
			<li><button className={navButton} onClick={() => navigate('/feed')}>
				<img src="/feed.svg"/>Feed<img src="/arrow.svg" />
			</button></li>
			<li><button className={navButton} onClick={() => navigate('/projects')}>
				<img src="/projects.svg"/>Projects <img src="/arrow.svg" />
			</button></li>
			<li><button className={navButton} onClick={() => navigate('/chats')}>
				<img src="/chat.svg"/>Chats 
			</button></li>
		</ul>
		<div className="bottom-6">
			<img
				src="/profile.jpg"
				className="w-12 h-12 rounded-full object-cover transition-all hover:scale-110 cursor-pointer"
				onClick={() => navigate ('/myprofile')}
			/>
		</div>
    </nav>
  )
}

export default Navbar
