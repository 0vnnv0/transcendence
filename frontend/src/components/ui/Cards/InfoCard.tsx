interface SimpleProjectCardProps {
  image: string;
  title: string;
  description: string;
}

const SimpleProjectCard = ({
  image,
  title,
  description,
}: SimpleProjectCardProps) => {
  return (
    <div className="relative flex flex-1 flex-col gap-4 p-2 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow">
      
      {/* Image Container */}
      <img
        src={image}
        alt={description}
        className="bg-gray-400 w-full flex-1 rounded-2xl object-cover"
      />

      {/* Content Container (Portrait padding) */}
      <div className="flex flex-1 flex-col gap-4 pb-2 px-2">
        {/* title on the left, description on the right */}
        <div className="flex flex-row justify-between items-start gap-4">
          <p className="text-paragraph flex-1">
            {title}
          </p>
          <h1 className="text-subtitle text-right shrink-0">
            {description}
          </h1>
        </div>
      </div>

    </div>
  );
};

export default SimpleProjectCard;
