import Tag from './Tag';
import type { CustomIconName } from '../Icon/CustomIcons';

export interface TagData {
	icon?: CustomIconName;
  	description: string;
}

interface TagListProps {
  tags: (string | TagData)[];
  className?: string;
}

const TagList = ({ tags, className = '' }: TagListProps) => (
  <div className={`flex flex-wrap gap-1 ${className}`}>
    {tags.map((tag) => {
      const normalized: TagData = typeof tag === 'string' ? { description: tag } : tag;
      return (
        <Tag
          key={normalized.description}
          description={normalized.description}
          icon={normalized.icon}
        />
      );
    })}
  </div>
);

export default TagList;

// interface TagListProps {
//   tags: string[];
//   className?: string;
// }
// const TagList = ({ tags, className = '' }: TagListProps) => (
//   <div className={`flex flex-wrap gap-1 ${className}`}>
//     {tags.map((tag) => (
//       <span key={tag} className="text-tag bg-mild-purple px-2 py-1 rounded-4xl border border-gray-500">
//         {tag}
//       </span>
//     ))}
//   </div>
// );

// export default TagList;
