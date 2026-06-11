import React from 'react';
import { CustomIcons } from '../Icon/CustomIcons';
import type { CustomIconName } from '../Icon/CustomIcons';

// this interface inherits from React.ButtonHTMLAttributes<HTMLButtonElement>
// so that we can use built-in attributes like onClick, type, form etc...
// ButtonHTMLAttributes tells TS the Button should accept any standard HTML button attribute
// has to be HTMLButtonElement and not <a> or <div>
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: CustomIconName;
}

// FC == Functional Component -> it expects props defined in ButtonProps interface
// we need ...props to expose all other attributes the user passed to the HTML button
// this is needed to use onClick or id
// need to destructure className to add custom styles from the outside
// children is a prop that represents everything between the opening and closing tags of <Button>children</Button>
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  // Base styles that every button will have
  const baseStyles = "text-cta-bold text-white border border-black inline-flex items-center justify-center w-fit transition-all duration-200 rounded-lg gap-1 active:scale-98 disabled:opacity-50 disabled:pointer-events-none";

  // Variant-specific styles
  const variants = {
    primary: "bg-purple hover:bg-purple-dark",
    secondary: "bg-black hover:bg-purple-dark",
	danger: "text-white hover:bg-purple-dark"
  };

  // Size-specific styles
  const sizes = {
	sm: "px-2 py-2 text-xs",
    md: "px-2 py-2 text-sm",
    lg: "px-8 py-3 text-lg"
  };

  const iconSizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  // Combine all classes
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  // Read the custom icon from the mapping dictionary
  const IconComponent = icon ? CustomIcons[icon] : null;

  return (
    <button
      className={classes}
      disabled={disabled}
      {...props}
    >
		{IconComponent && (
        	<IconComponent size={16} className={`${iconSizeClasses[size]}`} aria-hidden="true" />
      	)}
		{children}
    </button>
  );
};

export default Button;
