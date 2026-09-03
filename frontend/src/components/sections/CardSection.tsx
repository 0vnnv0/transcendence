// src/components/sections/CardSection.tsx
import React from 'react';
import ProjectFilters from '../ui/Filters/Filters';

// Main Wrapper Props
type CardSectionProps = {
  title?: string;
  filter?: boolean;
  children: React.ReactNode;
};

function CardSection({ title, filter = false, children }: CardSectionProps) {
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
        <div className={`flex flex-row justify-between w-full items-end ${filter ? 'my-4' : ''} pr-3`}>
			<h2 className="text-lead">
				{title}
			</h2>
			{filter && <ProjectFilters />}
		</div>
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
  columns?: 2 | 3 | 4 | 'none'; // Added dynamic columns prop (defaults to 3)
  children: React.ReactNode;
};

const layoutMap = {
  "none": 'flex gap-4',
  2: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
  3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  4: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
};

CardSection.Body = function CardSectionBody({
	viewMode = 'grid',
	columns = 3,
	children
 }: CardSectionBodyProps) {

	const layoutClass = viewMode === 'grid'
    ? layoutMap[columns]
    : 'flex flex-col gap-4';

  return (
    <div className={layoutClass}>
      {children}
    </div>
  );
};

export default CardSection;
