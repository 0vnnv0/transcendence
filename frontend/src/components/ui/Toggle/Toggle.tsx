import React from 'react';
import Option from '../Options/Options';
import type { CustomIconName } from '../Icon/CustomIcons';

interface ToggleOption {
  value: string;
  label?: string;
  icon?: CustomIconName;
  ariaLabel?: string;
}

interface ToggleProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Controlled single-select toggle. Options can be icon-only, label-only, or both —
// covers both "icon toggle updating global state" and "text toggle inside a form".
const Toggle: React.FC<ToggleProps> = ({ options, value, onChange, disabled = false, size = 'md', className = '' }) => {
  return (
    <div className={`inline-flex gap-1 ${className}`}>
      {options.map((option) => (
        <Option
          key={option.value}
          label={option.label}
          icon={option.icon}
          size={size}
          selected={value === option.value}
		  disabled={disabled}
          onClick={() => onChange(option.value)}
          aria-label={option.ariaLabel ?? option.label}
        />
      ))}
    </div>
  );
};

export default Toggle;

// import React from 'react';
// import Button from '../Button/Button'; // adjust path to match your file structure

// type ViewMode = 'grid' | 'list';

// interface ViewModeToggleProps {
//   viewMode: ViewMode;
//   onToggle: (mode: ViewMode) => void;
//   className?: string;
// }

// const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
//   viewMode,
//   onToggle,
//   className = '',
// }) => {
//   return (
//     <div className={`inline-flex gap-1 ${className}`}>
//       <Button
//         icon="grid" 
//         variant={viewMode === 'grid' ? 'secondary' : 'tertiary'}
//         size="sm"
//         onClick={() => onToggle('grid')}
//         aria-label="Grid view"
//       />
//       <Button
//         icon="list"
//         variant={viewMode === 'list' ? 'secondary' : 'tertiary'}
//         size="sm"
//         onClick={() => onToggle('list')}
//         aria-label="List view"
//       />
//     </div>
//   );
// };

// export default ViewModeToggle;
