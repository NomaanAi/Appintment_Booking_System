import React from 'react';

const Button = ({ children, type = 'button', variant = 'primary', onClick, className = '', disabled = false, fullWidth = false }) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white focus:ring-gray-500",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
        outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-800",
        ghost: "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
