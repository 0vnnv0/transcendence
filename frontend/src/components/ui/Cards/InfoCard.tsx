import { CustomIcons } from '../Icon/CustomIcons';
import type { CustomIconName } from '../Icon/CustomIcons';

interface SimpleProjectCardProps {
  title: string;
  description: string;
  icon: CustomIconName;
}

const SimpleProjectCard = ({
  title,
  description,
  icon,
}: SimpleProjectCardProps) => {
	const IconComponent = icon ? CustomIcons[icon] : null;
  return (
    <div className="relative flex flex-1 flex-col gap-4 p-6 bg-white rounded-3xl shadow-sm transition-shadow">
      
		{IconComponent && (
			<IconComponent size={24} aria-hidden="true" />
		)}

		<div className="flex flex-col justify-between items-start gap-1">
			<p className="text-paragraph-bold flex-1">
				{title}
			</p>
			<h1 className="text-subtitle text-right shrink-0">
				{description}
			</h1>
		</div>
    </div>
  );
};

export default SimpleProjectCard;
