import Tag from './Tag';
import type { CustomIconName } from '../Icon/CustomIcons';

export interface TagData {
	icon?: CustomIconName;
  	description: string;
}

interface TagListProps {
  tags: (string | TagData)[];
  className?: string;
  color?: 'red' | 'purple' | 'orange';
  size?: 'large' | 'small';
}

const TagList = ({ tags, className = '', color='purple', size = 'small' }: TagListProps) => (
  <div className={`flex flex-wrap gap-1 ${className}`}>
    {tags.map((tag) => {
      const normalized: TagData = typeof tag === 'string' ? { description: tag } : tag;
      return (
        <Tag
		  size={size}
		  color={color}
          key={normalized.description}
          description={normalized.description}
          icon={normalized.icon}
        />
      );
    })}
  </div>
);

export default TagList;

