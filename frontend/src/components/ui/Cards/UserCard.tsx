// cards/UserCard.tsx
import Button from '../Button/Button';
import TagList from '../TagList/TagList';

interface UserCardProps {
  layout?: 'portrait' | 'landscape';
  image: string;
  title?: string;
  isOnline?: boolean;
  route?: string;
  tags?: string[];
  ctaText?: string;
  onCtaClick?: () => void;
}
const UserCard = ({
  layout = 'landscape',
  image,
  title,
  tags,
  ctaText,
  onCtaClick,
}: UserCardProps) => {

  const isLandscape = layout === 'landscape';

  return (
    <div
      className={`
        flex flex-1 gap-4 p-2 bg-white rounded-3xl shadow-sm
        hover:shadow-md hover:bg-gray-200 cursor-pointer transition-shadow
        ${isLandscape ? 'flex-row justify-between' : 'flex-col'}
      `}
    >
      <img
        src={image}
        alt=""
        className={`
          bg-gray-400 rounded-2xl object-cover
          ${isLandscape ? 'w-18 h-full' : 'w-full h-50 flex-1'}
        `}
      />
      <div
        className={`
          flex flex-1 flex-col
          ${isLandscape ? 'justify-center py-2 pr-2 gap-3' : 'pb-3 px-2 gap-4'}
        `}
      >
        <h1 className="text-subtitle">{title}</h1>
        <div className={`flex gap-4 ${isLandscape ? 'flex-row justify-between items-center' : 'flex-col'}`}>
          {tags && <TagList tags={tags} />}
          {ctaText && <Button icon='message' size='sm' onClick={onCtaClick}>{ctaText}</Button>}
        </div>
      </div>
    </div>
  );
};

export default UserCard;

// import Button from '../Button/Button'

// interface CardProps {
//   type: 'user' | 'project' | 'pin';
//   layout?: 'portrait' | 'landscape';
//   image: string;
//   title: string;
//   subtitle?: string;
//   description?: string;
//   tags?: string[];
//   ctaText?: string;
//   onCtaClick?: () => void;
// }

// const Card = ({
//   type,
//   layout = 'landscape',
//   image,
//   title,
//   subtitle,
//   description,
//   tags,
//   ctaText,
//   onCtaClick
// }: CardProps) => {

// 	// Define the base styles that never change
//   const baseStyles = "flex flex-1 gap-4 p-2 bg-white rounded-3xl relative shadow-sm hover:shadow-md transition-shadow";

//   // Define the "Layout" variations
//   const layoutStyles = {
//     portrait: "flex-col",
//     landscape: "flex-row justify-between",
//   };

// 	const tagPosition = [
// 		"flex flex-wrap gap-2",
// 		type === "project" ? "absolute top-4 right-4" : "",
// 	].join(" ");

//   // Combine them cleanly
//   const combinedClasses = `${baseStyles} ${layoutStyles[layout]}`;

// 	const tagElements = tags?.map((tag) => (
// 		<span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded-lg">
// 			{tag}
// 		</span>
// 	));

// 	return (
// 		<div className={combinedClasses}>
// 			{/* Image */}
// 			<img className={`
// 					bg-gray-400 h-50 rounded-2xl object-cover
// 					${type === 'user' && layout === 'landscape' ? "w-16 h-full" : "w-full flex-1"}
// 				`}
// 				src={image}
// 				alt=""
// 			/>

// 			<div className={`
// 				flex flex-1 flex-col gap-4 px-2 pb-3
// 				${layout === 'landscape' ? "justify-end" : ""}
// 			`}>
// 				{/* Header Div */}
// 				<div>
// 					<h1 className="font-[Geist_Mono] text-base font-bold">{title}</h1>
// 					{type === 'project' && <h2 className="font-kyiv font-medium text-sm">{subtitle}</h2>}
// 				</div>

// 				{/* Description */}
// 				{type === 'project' && <p className="font-kyiv text-sm">{description}</p>}

// 				{/* Footer Div */}
// 				<div className={`
// 					${layoutStyles[layout]} flex gap-4
// 					${type === 'pin' ? "flex-col" : ""}
// 				`}>
// 					{/* Tags Wrapper */}
// 					{(type === 'user' || type === 'project') &&
// 						<div className={tagPosition}>
// 							{tagElements}
// 						</div>
// 					}

// 					{ctaText && (type === 'user' || type === 'pin') && (
// 						<Button onClick={onCtaClick}>{ctaText}</Button>
// 					)}
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default Card;
