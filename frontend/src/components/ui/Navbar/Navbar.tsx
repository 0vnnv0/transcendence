import { useNavigate } from 'react-router-dom'
import SearchBar from '../Search/Search'
import NavItem from './NavItem'
import ChatMenu from './ChatMenu'
import MobileNav from './MobileNav'
import Button from '../../../components/ui/Button/Button'
import { useLogoutLogic } from '../../../hooks/useAuth'
import { useAuth } from '../../../components/context/AuthContext'
import { useUserProfile } from '../../../hooks/useUsers';

function Navbar() {
    const navigate = useNavigate()
    const { performLogout } = useLogoutLogic();
    const { userName } = useAuth();
    const userKey = userName !== "Guest" ? userName : null;
    const { data: profile, isLoading, isError } = useUserProfile(userKey);

  return (
	<>
	    {/* Desktop sidebar — unchanged, just hidden below md */}
		<nav className="hidden md:flex fixed left-0 top-0 h-screen w-70 flex-col flex-1 min-h-screen items-start gap-4 p-6 bg-background-grey">
			<div className="top-6 w-full">
				<SearchBar />
			</div>
			<ul className="flex flex-col mt-50 gap-2 w-full">
				<NavItem label="Dashboard" icon="home" route="/dashboard" />
				<NavItem label="Projects" icon="projects" route="/projects" /> 
				<NavItem label="Friends" icon="smiley" route="/friends" />    
			</ul>
			<ChatMenu />
			
			<div className="bottom-6 mt-auto">
				<div className="relative inline-block">
					<div 
						className="w-12 h-12 rounded-md bg-cover bg-center bg-no-repeat transition-all hover:scale-110 cursor-pointer bg-gray-800"
						onClick={() => navigate('/myprofile')}
						style={{ 
							backgroundImage: profile?.avatarUrl ? `url(${profile?.customAvatar || profile?.avatarUrl})` : 'none' 
						}}
					>
					</div> 
					<span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-black rounded-full"></span>
				</div>
				
				<div>
					<Button type="button" onClick={performLogout} className="mt-4">Logout</Button>
				</div>
			</div>
		</nav>

		{/* Mobile bottom nav */}
        <MobileNav />
	</>
  )
}

export default Navbar;
