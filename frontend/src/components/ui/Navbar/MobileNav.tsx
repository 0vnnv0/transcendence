import NavItem from './NavItem'
import Footer from '../Footer/Footer'

function MobileNav() {
    return (
		<div className="fixed md:hidden bottom-4 left-3 right-3 flex flex-col gap-2 z-50 ">
			<nav
				className="flex items-center justify-around
						bg-background-grey rounded-3xl px-2 py-2 shadow-lg"
			>
				<ul className="flex w-full items-center justify-around">
					<NavItem label="Dashboard" icon="home" route="/dashboard" variant="mobile" />
					<NavItem label="Projects" icon="projects" route="/projects" variant="mobile" />
					<NavItem label="Friends" icon="smiley" route="/friends" variant="mobile" />
					<NavItem label="Chats" icon="chat" route="/chats" variant="mobile" />
					<NavItem label="Profile" icon="profile" route="/myprofile" variant="mobile" />    
				</ul>
			</nav>
		</div>
    )
}

export default MobileNav
