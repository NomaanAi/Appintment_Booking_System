import React from 'react';

const Card = ({ children, className = '', title }) => {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
            {title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};

export default Card;
