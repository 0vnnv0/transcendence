import React from 'react';
import { CustomIcons } from '../Icon/CustomIcons';
import type { CustomIconName } from '../Icon/CustomIcons';

interface TagProps {
  description: string;
  icon?: CustomIconName;
  color?: 'orange' | 'purple' | 'red';
  size?: 'large' | 'small';
}

const Tag: React.FC<TagProps> = ({ description, icon, color = 'purple', size = 'small' }) => {
  // Read the custom icon from the mapping dictionary
  const IconComponent = icon ? CustomIcons[icon] : null;

  const colors = {
	orange: "bg-orange-100",
	purple: "bg-mild-purple",
	red: "bg-red-200"
  }

  const sizes = {
	large: "px-2 py-1.25 text-tag-big",
	small: "px-1.5 py-0.75 text-tag"
  }

  return (
    <span className={`${colors[color]} ${sizes[size]} w-fit rounded-4xl border border-gray-500 inline-flex items-center gap-1 h-fit`}>
      {IconComponent && (
        <IconComponent size={size === 'large' ? 20 : 16} className="w-3 h-3" aria-hidden="true" />
      )}
      {description}
    </span>
  );
};

export default Tag;
