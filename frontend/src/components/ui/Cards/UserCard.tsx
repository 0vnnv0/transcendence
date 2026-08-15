import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import TagList, { type TagData } from '../TagList/TagList';

interface UserCardProps {
  layout?: 'portrait' | 'landscape';
  image: string;
  title?: string;
  isOnline?: boolean;
  route?: string;
  username: string; // used to build the profile link
  tags?: TagData[];
  ctaText?: string;
  onCtaClick?: () => void;
}

const UserCard = ({
  layout = 'landscape',
  image,
  username,
  tags,
  ctaText,
  onCtaClick,
}: UserCardProps) => {

  const isLandscape = layout === 'landscape';

  return (
    <Link
		to={`/users/${username}`}
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
        <h1 className="text-subtitle">{username}</h1>
        <div className={`flex gap-4 ${isLandscape ? 'flex-row justify-between items-center' : 'flex-col'}`}>
          {tags && <TagList tags={tags} />}
          {ctaText && (
            <Button
              icon="message"
              size="sm"
              onClick={(e) => {
                e.preventDefault(); // stop the Link navigation
                e.stopPropagation();
                onCtaClick?.();
              }}
            >
              {ctaText}
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default UserCard;
