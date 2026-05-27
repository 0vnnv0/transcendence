// src/components/sections/CardSection.tsx
import React from 'react';

// Main Wrapper Props
type CardSectionProps = {
  title: string;
  children: React.ReactNode;
};

function CardSection({ title, children }: CardSectionProps) {
  // We search through children to separate the Filters from the Body content
  const childrenArray = React.Children.toArray(children);
  
  const filtersChild = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === CardSection.Filters
  );
  
  const bodyChild = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === CardSection.Body
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lead">
          {title}
        </h2>
        {filtersChild}
      </div>
      {bodyChild}
    </div>
  );
}

// 2. Filters Sub-Component Container
CardSection.Filters = function CardSectionFilters({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 self-start sm:self-auto">
      {children}
    </div>
  );
};

// 3. Body Sub-Component Container (Handles Layout)
type CardSectionBodyProps = {
  viewMode?: 'grid' | 'list';
  children: React.ReactNode;
};

CardSection.Body = function CardSectionBody({ viewMode = 'grid', children }: CardSectionBodyProps) {
  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'flex flex-col gap-4'
      }
    >
      {children}
    </div>
  );
};

export default CardSection;
