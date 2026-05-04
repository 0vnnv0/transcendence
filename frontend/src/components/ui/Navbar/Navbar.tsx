import { useNavigate } from 'react-router-dom'
import Input from '../Input/Input'

function Navbar() {
  const navigate = useNavigate()
  const navButton = "text-green-300 hover:text-green-700 transition-colors"

  return (
	<nav className="fixed left-0 top-0 h-screen w-48 flex flex-col items-start justify-center gap-4 p-6 bg-green-950/30 backdrop-blur-md border-r border-green-500/20">
		<div className="absolue top-6">
			<Input placeholder="Suchen..." />
		</div>
		<ul className="flex flex-col gap-2 mt-auto mb-auto">
     	   <li><button className={navButton} onClick={() => navigate('/dashboard')}>Dashboard</button></li>
			<li><button className={navButton} onClick={() => navigate('/feed')}>Feed</button></li>
			<li><button className={navButton} onClick={() => navigate('/projects')}>All Projects</button></li>
			<li><button className={navButton} onClick={() => navigate('/chats')}>Chats</button></li>
		</ul>
    </nav>
  )
}

export default Navbar