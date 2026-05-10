import TagList from '../TagList/TagList';

interface ProjectCardProps {
  layout?: 'portrait' | 'landscape';
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
}
const ProjectCard = ({
  layout = 'landscape',
  image,
  title,
  subtitle,
  description,
  tags,
}: ProjectCardProps) => {
  const isLandscape = layout === 'landscape';
  return (
    <div
      className={`
        relative flex flex-1 gap-4 p-2 bg-white rounded-3xl shadow-sm
        hover:shadow-md transition-shadow
        ${isLandscape ? 'flex-row justify-between' : 'flex-col'}
      `}
    >
      {/* Tags positioned absolutely for project cards */}
      {tags && (
        <div className="absolute top-4 right-4">
          <TagList tags={tags} />
        </div>
      )}
      <img
        src={image}
        alt=""
        className="bg-gray-400 h-50 w-full flex-1 rounded-2xl object-cover"
      />
      <div
        className={`
          flex flex-1 flex-col gap-4 pb-4
          ${isLandscape ? 'justify-end py-2 pr-2' : 'px-2'}
        `}
      >
        <div>
          <h1 className="font-[Geist_Mono] text-base font-bold">{title}</h1>
          {subtitle && <h2 className="font-kyiv font-medium text-sm">{subtitle}</h2>}
        </div>
        {description && <p className="font-kyiv text-sm">{description}</p>}
      </div>
    </div>
  );
};

export default ProjectCard;
