import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import TagList, { type TagData } from '../TagList/TagList';
import Tag from '../TagList/Tag';

interface UserCardProps {
  key?: number;
  layout?: 'portrait' | 'landscape';
  avatarUrl: string;
  title?: string;
  isOnline?: boolean;
  showStatus?: boolean;
  route?: string;
  username: string; // used to build the profile link
  tags?: TagData[];
  ctaText?: string;
  friendship?: boolean;
  onCtaClick?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
}

const UserCard = ({
  layout = 'landscape',
  avatarUrl,
  isOnline,
  showStatus = false,
  username,
  tags,
  ctaText,
  friendship,
  onCtaClick,
  onAccept,
  onDecline,
}: UserCardProps) => {

	const isLandscape = layout === 'landscape';
  return (
    <Link
		to={`/users/${username}`}
		className={`
			flex flex-1 gap-3 p-2 bg-white rounded-3xl shadow-sm relative
			hover:shadow-mdcursor-pointer transition-shadow
			border border-white hover:border-black hover:scale-101 transition-all transition-colors transition-transform
			${isLandscape ? 'flex-row justify-between' : 'flex-col'}
		`}
	>  
	  { friendship && !isLandscape && (
		<div className="absolute top-4 right-4">
		  <Tag description='Friends' icon='smiley' color='orange' />
		 </div>
	  )}
      <div className={`relative ${isLandscape ? 'w-22 h-full sm:h-22' : 'w-full h-50 sm:h-40 xl:h-48'} rounded-2xl overflow-hidden bg-gray-400`}> {/* fixed size lives here */}
		<img
			src={avatarUrl}
			alt=""
			className="w-full h-full object-cover"
		/>
		 {showStatus && (
          <span
            className={`
              absolute bottom-1 right-1 w-6 h-6 rounded-full border-1 border-white
              ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
            `}
            aria-label={isOnline ? 'online' : 'offline'}
          />
        )}
	  </div>
      <div
        className={`
          flex flex-1 flex-col
          ${isLandscape ? 'justify-center py-2 pr-2 gap-2' : 'pb-3 px-2 gap-2.5'}
        `}
      >
        <h1 className="text-subtitle">{username}</h1>
        <div className={`flex gap-3 ${isLandscape ? 'flex-col sm:flex-row justify-between items-start sm:items-center' : 'flex-col'}`}>     
			<div className="flex flex-row gap-1">
				{tags && <TagList tags={tags} />}
				{ friendship && isLandscape &&
					<Tag description='Friends' icon='smiley' color='orange' />
				}
			</div>

            {onAccept && onDecline ? (
            <div className={`flex gap-2 ${isLandscape ? '' : 'w-full'}`}>
              <Button
                size="sm"
                variant="primary"
                onClick={(e) => {
                  e.preventDefault(); 
                  e.stopPropagation();
                  onAccept();
                }}
              >
                Accept
              </Button>
              
              <Button
                size="sm"
                variant="secondary" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDecline();
                }}
              >
                Decline
              </Button>
            </div>
          ) : ctaText ? (
            <Button
              icon="message"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCtaClick?.();
              }}
            >
              {ctaText}
            </Button>
          ) : null}
          
        </div>
      </div>
    </Link>
  );
};

export default UserCard;
