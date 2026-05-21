import { useNavigate } from 'react-router-dom'

interface NavItemProps {
    label: string;
    iconPath: string;
    route: string;
}

function NavItem({ label, iconPath, route }: NavItemProps) {
    const navigate = useNavigate();
    const navButton = "w-full flex items-center justify-between font-kyiv text-bg text-white hover:bg-gray-500/60 hover:rounded-md hover:scale-110 transition-all cursor-pointer"

    return(
        <li>
            <button className={navButton} onClick={() => navigate(route)} >
            <span className="flex items-center my-auto gap-2 w-full">
                <img src={iconPath} alt={label} />
                {label}
            </span>
            <img src="/arrow.svg" alt="arrow" />
            </button>
        </li>
    );
}
                          
export default NavItem