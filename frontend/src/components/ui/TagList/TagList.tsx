interface TagListProps {
  tags: string[];
  className?: string;
}
const TagList = ({ tags, className = '' }: TagListProps) => (
  <div className={`flex flex-wrap gap-1 ${className}`}>
    {tags.map((tag) => (
      <span key={tag} className="text-tag bg-mild-purple px-2 py-1 rounded-4xl border border-gray-500">
        {tag}
      </span>
    ))}
  </div>
);

export default TagList;
