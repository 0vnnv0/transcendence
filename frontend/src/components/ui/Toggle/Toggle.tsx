import React from 'react';
import Button from '../Button/Button'; // adjust path to match your file structure

type ViewMode = 'grid' | 'list';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onToggle: (mode: ViewMode) => void;
  className?: string;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onToggle,
  className = '',
}) => {
  return (
    <div className={`inline-flex gap-1 ${className}`}>
      <Button
        icon="grid" 
        variant={viewMode === 'grid' ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => onToggle('grid')}
        aria-label="Grid view"
      />
      <Button
        icon="list"
        variant={viewMode === 'list' ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => onToggle('list')}
        aria-label="List view"
      />
    </div>
  );
};

export default ViewModeToggle;
