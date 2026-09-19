import TagList from '../TagList/TagList';
import { useNavigate } from 'react-router-dom'
import { CustomIcons } from '../Icon/CustomIcons'

interface ProjectCardProps {
  layout?: 'portrait' | 'landscape';
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  route: string;
  tags?: string[];
}
const ProjectCard = ({
  layout = 'landscape',
  image,
  title,
  subtitle,
  description,
  route,
  tags,
}: ProjectCardProps) => {
  const isLandscape = layout === 'landscape';
  const navigate = useNavigate()
  const IconComponent = CustomIcons["arrowRight"];

  return (

    <div
	  onClick={() => navigate(route)}
      className={`
	  	group relative flex flex-1 gap-4 p-2 bg-white rounded-3xl shadow-sm h-auto
        hover:shadow-md border border-white hover:border-black hover:scale-101 transition-all transition-colors transition-transform cursor-pointer transition-shadow
        ${isLandscape ? 'flex-row justify-between' : 'flex-col'}
      `}
    >
      {tags && (
        <div className="absolute top-4 right-4 max-w-[300px] h-6 overflow-hidden">
          <TagList tags={tags} amount={3}/>
        </div>
      )}
      <img
        src={image}
        alt=""
        className={`bg-gray-400 w-full flex-1 rounded-2xl object-cover
		${isLandscape ? 'h-70 max-w-1/2' : 'h-50 max-h-50'}`}
      />
      <div
        className={`
          flex flex-1 flex-col gap-2 pb-4
          ${isLandscape ? 'justify-end py-2 pr-2' : 'px-2'}
        `}
      >
        <div>
          <h1 className="text-subtitle">{title}</h1>
          {subtitle && <h2 className="text-paragraph-bold">{subtitle}</h2>}
        </div>
        {description && (
			<div className="relative">
				<p className="text-paragraph line-clamp-3">
				<span
					className="float-right w-0"
					style={{ height: 'calc(2 * 1.5em)' }}
				/>
				<span className="float-right clear-right w-6 h-[1.5em]" />
				{description}
				</p>
				<span className="absolute bottom-0 right-1 transition-all duration-300 ease-out group-hover:right-0">
					<IconComponent size={20} color="black" aria-hidden="true" />
				</span>
			</div>
			)}
      </div>
    </div>
  );
};

export default ProjectCard;
