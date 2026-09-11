import { useNavigate } from 'react-router-dom'
import { CustomIcons } from '../Icon/CustomIcons';
import type { CustomIconName } from '../Icon/CustomIcons';

interface NavItemProps {
    label: string;
	icon: CustomIconName;
    route: string;
	variant?: 'desktop' | 'mobile';
}

function NavItem({ label, icon, route, variant = 'desktop' }: NavItemProps) {
    const navigate = useNavigate();
	const IconComponent = icon ? CustomIcons[icon] : null;

    if (variant === 'mobile') {
        return (
            <li className="flex-1">
                <button
                    className="w-full flex flex-col items-center justify-center gap-1 py-1 text-white font-kyiv text-xs active:scale-95 transition-all cursor-pointer"
                    onClick={() => navigate(route)}
                >
                    {IconComponent && (
						<IconComponent size={20} color='white' aria-hidden="true" />
					)}
                    <span className="text-[10px]">{label}</span>
                </button>
            </li>
        );
    }

    const navButton = "w-full flex items-center justify-between font-kyiv text-bg text-white hover:bg-gray-500/60 hover:rounded-md hover:scale-110 transition-all cursor-pointer"

    return(
        <li>
            <button className={navButton} onClick={() => navigate(route)} >
            <span className="flex items-center my-auto gap-2 w-full">
                {IconComponent && (
					<IconComponent size={20} color='white' aria-hidden="true" />
				)}
                {label}
            </span>
            <img src="/arrow.svg" alt="arrow" />
            </button>
        </li>
    );
}
                          
export default NavItem
