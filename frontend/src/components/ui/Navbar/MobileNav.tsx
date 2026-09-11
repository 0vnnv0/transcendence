import NavItem from './NavItem'

function MobileNav() {
    return (
        <nav
            className="fixed bottom-4 left-3 right-3 z-50 flex md:hidden items-center justify-around
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
    )
}

export default MobileNav
