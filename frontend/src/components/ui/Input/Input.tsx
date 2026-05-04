import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  className = '',
  ...props
}) => {
  return (
    <div className="flex items-center gap-3">
      {label && <label className="text-sm font-medium text-violet-300 w-24 text-right">{label}</label>}
      <input
        className={`bg-transparent border-b-2 border-violet-500 px-1 py-1 text-sm outline-none focus:border-violet-300 transition-colors duration-200 w-35 text-violet-900 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;