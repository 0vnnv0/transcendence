import Button from '../Button/Button';

interface PinCardProps {
  image: string;
  altText: string;
  username: string;
  message?: string;
  ctaText: string;
  onCtaClick?: () => void;
}

const PinCard = ({
  image,
  altText,
  username,
  message,
  ctaText = 'Message',
  onCtaClick,
}: PinCardProps) => {
  return (
    <div className="flex flex-row flex-1 gap-4 p-2 bg-white rounded-3xl shadow-sm hover:shadow-md hover:bg-gray-200 cursor-pointer transition-shadow">
		<img
			src={image}
			alt={altText}
			className="bg-gray-400 w-18 rounded-2xl object-cover"
		/>
		<div className="flex flex-1 flex-row justify-between py-2 pr-2 items-center">
			<div>
				<h2 className="text-paragraph-bold mb-1">{username}</h2>
				{message && <p className="text-paragraph">{message}</p>}
			</div>
			{ctaText && <Button onClick={onCtaClick}>{ctaText}</Button>}
		</div>
    </div>
  );
};

export default PinCard;
