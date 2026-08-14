import React from 'react';
import Toggle from '../Toggle/Toggle';

type ViewMode = 'grid' | 'list';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onToggle: (mode: ViewMode) => void;
  className?: string;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, onToggle, className = '' }) => {
  return (
    <Toggle
      size="sm"
      value={viewMode}
      onChange={(v) => onToggle(v as ViewMode)}
      options={[
        { value: 'grid', icon: 'grid', ariaLabel: 'Grid view' },
        { value: 'list', icon: 'list', ariaLabel: 'List view' },
      ]}
      className={className}
    />
  );
};

export default ViewModeToggle;
