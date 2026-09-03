import Tag from './Tag';
import type { CustomIconName } from '../Icon/CustomIcons';

export interface TagData {
	icon?: CustomIconName;
  	description: string;
}

interface TagListProps {
  tags: (string | TagData)[];
  className?: string;
  amount?: 1 | 2 | 3 | 4 | 5 | 'all';
  color?: 'red' | 'purple' | 'orange';
  size?: 'large' | 'small';
}

const TagList = ({ tags, amount = 'all', className = '', color='purple', size = 'small' }: TagListProps) => {
  const visibleTags = amount === 'all' ? tags : tags.slice(0, amount);

  return (
	<div className={`flex flex-wrap gap-1 justify-end ${className}`}>
		{visibleTags.map((tag) => {
		const normalized: TagData = typeof tag === 'string' ? { description: tag } : tag;
		return (
			<Tag
				key={normalized.description}
				description={normalized.description}
				icon={normalized.icon}
				size={size}
				color={color}
			/>
		);
		})}
	</div>
  )
};

export default TagList;
