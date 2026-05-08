import React from 'react';
// import Button from './Button';

interface CardProps {
  type: 'User' | 'Project' | 'Pin';
  image: string;
  children: React.ReactNode;
}

// 1. The Main Wrapper
const Card = ({ type, image, children }: CardProps) => {
//   const isUser = type === 'User';
  
  return (
    <div className={`bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow`}>
      <img 
        src={image} 
        className={"bg-gray-400"} 
      />
      <div className="px-2 space-y-2">
        {children}
      </div>
    </div>
  );
};

// 2. The Sub-components (The "Slots")
Card.Title = ({ children }: { children: React.ReactNode }) => <h1 className="text-xl font-bold text-gray-900">{children}</h1>;
Card.Subtitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-sm font-medium text-violet-600 uppercase">{children}</h2>;
Card.Body = ({ children }: { children: React.ReactNode }) => <p className="text-gray-600 text-sm">{children}</p>;
Card.Tags = ({ children }: { children: React.ReactNode }) => <div className="flex flex-wrap gap-2 py-2">{children}</div>;
Card.Footer = ({ children }: { children: React.ReactNode }) => <div className="pt-4 border-t border-gray-100">{children}</div>;

export default Card;
