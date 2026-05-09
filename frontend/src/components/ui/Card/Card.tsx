import React from 'react';
import Button from '../Button/Button'

interface CardProps {
  type: 'User' | 'Project' | 'Pin';
  layout: 'Portrait' | 'Landscape';
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  ctaText?: string;
  onCtaClick?: () => void;
}

const Card = ({
  type,
  image,
  title,
  subtitle,
  description,
  tags,
  ctaText,
  onCtaClick
}: CardProps) => {


  return (
    <div className="flex-1 bg-white p-2 pb-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
      {/* Image */}
      <img
        src={image}
        className="bg-gray-400 h-50 rounded-2xl object-cover"
        alt=""
      />

      <div className="flex flex-col gap-4 px-2">
        {/* Header Div */}
        <div>
          <h1 className="font-[Geist_Mono] text-base font-bold">{title}</h1>
          <h2 className="font-kyiv font-medium text-sm">{subtitle}</h2>
        </div>

        {/* Description */}
        <p className="font-kyiv text-sm">{description}</p>

        {/* Footer Div */}
        <div className="flex flex-col gap-4">
          {/* Tags Wrapper */}
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded-lg">
                {tag}
              </span>
            ))}
          </div>

          {/* CTA Button */}
          {ctaText && (
            <Button
              onClick={onCtaClick}
              className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              {ctaText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;

// import React from 'react';
// // import Button from './Button';

// interface CardProps {
//   type: 'User' | 'Project' | 'Pin';
//   image: string;
//   children: React.ReactNode;
// }

// // 1. The Main Wrapper
// const Card = ({ type, image, children }: CardProps) => {
// //   const isUser = type === 'User';

//   return (
//     <div className={`bg-white p-2 pb-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4`}>
//       <img
//         src={image}
//         className={"bg-gray-400 h-50 rounded-2xl"}
//       />
//       <div className="flex flex-col gap-4 px-2">
//         {children}
//       </div>
//     </div>
//   );
// };

// // 2. The Sub-components (The "Slots")
// Card.Head = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
// Card.Title = ({ children }: { children: React.ReactNode }) => <h1 className="font-[Geist_Mono] text-lg font-bold">{children}</h1>;
// Card.Subtitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-sm font-bold">{children}</h2>;
// Card.Body = ({ children }: { children: React.ReactNode }) => <p className="text-sm">{children}</p>;
// Card.Footer = ({ children }: { children: React.ReactNode }) => <div className="flex flex-col gap-4">{children}</div>;
// Card.Tags = ({ children }: { children: React.ReactNode }) => <div className="flex flex-wrap">{children}</div>;

// export default Card;
