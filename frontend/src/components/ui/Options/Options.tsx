import React from 'react';
import { CustomIcons } from '../Icon/CustomIcons';
import type { CustomIconName } from '../Icon/CustomIcons';

interface OptionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean;
  label?: string;
  icon?: CustomIconName;
  size?: 'sm' | 'md' | 'lg';
}

// Shared pill/icon button used by Toggle (single-select) and MultiSelect.
// Renders an icon, a label, or both — caller decides which to pass.
const Option: React.FC<OptionProps> = ({
  selected,
  label,
  icon,
  size = 'md',
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = "text-tag border inline-flex items-center justify-center w-fit transition-all duration-200 rounded-md gap-1 active:scale-98 disabled:opacity-50 disabled:pointer-events-none";

  // Matches Button's secondary/tertiary look — selected = black, unselected = dark background
  const variants = {
    selected: "bg-white text-black border-black hover:border-purple-dark hover:bg-mild-purple",
    unselected: "bg-background-dark text-black border-transparent hover:bg-white",
  };

  const sizes = {
    sm: "px-2 py-2",
    md: "px-1.5 pt-1 pb-1.5 md:text-xs w-full md:w-min",
    lg: "px-8 py-3 text-lg",
  };

  const iconSizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  // Disabled: keep full color for readability, just kill interaction/hover.
  // Not disabled: normal hover + active-scale feedback.
  const stateStyles = disabled ? "pointer-events-none cursor-default disabled:opacity-100" : "active:scale-98";

  const classes = `${baseStyles} ${icon ? 'pt-0.5' : ''} ${selected ? variants.selected : variants.unselected} ${sizes[size]} ${stateStyles} ${className}`;

  const IconComponent = icon ? CustomIcons[icon] : null;
//   const iconColor = selected ? 'white' : 'black';

  return (
    <button type="button" className={classes} disabled={disabled} {...props}>
      {IconComponent && (
        <IconComponent size={16} className={iconSizeClasses[size]} aria-hidden="true" />
      )}
      {label}
    </button>
  );
};

export default Option;
