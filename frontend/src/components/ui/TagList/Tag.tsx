import React from 'react';
import { CustomIcons } from '../Icon/CustomIcons';
import type { CustomIconName } from '../Icon/CustomIcons';

interface TagProps {
  description: string;
  icon?: CustomIconName;
}

const MAX_LENGTH = 18;

const Tag: React.FC<TagProps> = ({ description, icon }) => {
  // Read the custom icon from the mapping dictionary
  const IconComponent = icon ? CustomIcons[icon] : null;
  const truncatedDescription = description.length > MAX_LENGTH
  	 ? `${description.slice(0, MAX_LENGTH)}…` : description;

  return (
    <span className="text-tag bg-mild-purple px-2 py-1 rounded-4xl border border-gray-500 inline-flex items-center gap-1">
      {IconComponent && (
        <IconComponent size={16} className="w-3 h-3" aria-hidden="true" />
      )}
      {truncatedDescription}
    </span>
  );
};

export default Tag;
