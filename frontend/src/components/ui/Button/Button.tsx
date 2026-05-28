import React from 'react';

// this interface inherits from React.ButtonHTMLAttributes<HTMLButtonElement>
// so that we can use built-in attributes like onClick, type, form etc...
// ButtonHTMLAttributes tells TS the Button should accept any standard HTML button attribute
// has to be HTMLButtonElement and not <a> or <div>
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'md' | 'lg';
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
  className = '',
  disabled,
  ...props
}) => {
  // Base styles that every button will have
  const baseStyles = "text-cta-bold border border-gray-500 bg-sunshine inline-flex items-center justify-center transition-all duration-200 rounded-lg active:scale-98 disabled:opacity-50 disabled:pointer-events-none";

  // Variant-specific styles
  const variants = {
    primary: "hover:bg-sunshine-hover",
    secondary: "hover:bg-sunshine-hover",
	danger: "text-white hover:bg-sunshine-hover"
  };

  // Size-specific styles
  const sizes = {
    md: "px-4 py-2 text-sm",
    lg: "px-8 py-3 text-lg"
  };

  // Combine all classes
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
