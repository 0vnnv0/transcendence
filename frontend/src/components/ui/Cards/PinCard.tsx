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
  ctaText = 'Kontaktieren',
  onCtaClick,
}: PinCardProps) => {
  return (
    <div className="flex flex-row flex-1 gap-4 p-2 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow">
		<img
			src={image}
			alt={altText}
			className="bg-gray-400 w-18 rounded-2xl object-cover"
		/>
		<div className="flex flex-1 flex-row justify-between py-2 pr-2 items-center">
			<div>
				<h2 className="font-kyiv font-medium text-sm mb-1">{username}</h2>
				{message && <p className="font-kyiv text-sm">{message}</p>}
			</div>
			{ctaText && <Button onClick={onCtaClick}>{ctaText}</Button>}
		</div>
    </div>
  );
};

export default PinCard;
