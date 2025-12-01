import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'success' | 'arcade';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-arcade uppercase transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-xlent-green text-white border-b-4 border-xlent-dark hover:bg-opacity-90",
    danger: "bg-red-600 text-white border-b-4 border-red-800 hover:bg-red-500",
    success: "bg-green-600 text-white border-b-4 border-green-800 hover:bg-green-500",
    arcade: "bg-xlent-accent text-black border-b-4 border-orange-600 hover:bg-yellow-300 shadow-[0_0_15px_rgba(244,211,94,0.5)]"
  };

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};