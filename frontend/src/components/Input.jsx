import React from 'react';

const Input = ({ label, type = 'text', name, value, onChange, placeholder, error, required = false, disabled = false }) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white transition-colors
                    ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-900' : ''}
                `}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default Input;
